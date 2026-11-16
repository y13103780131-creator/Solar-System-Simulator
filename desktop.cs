using System;
using System.IO;
using System.Drawing;
using System.Reflection;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

[assembly: AssemblyTitle("太阳系漫游模拟器")]
[assembly: AssemblyProduct("太阳系漫游模拟器")]
[assembly: AssemblyDescription("太阳系互动探索桌面程序")]

internal sealed class SolarAtlasWindow : Form
{
    private readonly WebView2 view = new WebView2();
    private bool fullscreen = true;
    private readonly string installDirectory = AppDomain.CurrentDomain.BaseDirectory;
    public SolarAtlasWindow()
    {
        Text = "太阳系漫游模拟器";
        StartPosition = FormStartPosition.CenterScreen;
        MinimumSize = new Size(900, 620);
        FormBorderStyle = FormBorderStyle.None;
        WindowState = FormWindowState.Normal;
        Bounds = Screen.PrimaryScreen.Bounds;
        BackColor = Color.FromArgb(5, 9, 16);
        view.Dock = DockStyle.Fill;
        Controls.Add(view);
        Shown += async (sender, args) => {
            try {
                string dataDirectory = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "SOLARIS", "WebView2");
                Directory.CreateDirectory(dataDirectory);
                CoreWebView2EnvironmentOptions options = new CoreWebView2EnvironmentOptions("--autoplay-policy=no-user-gesture-required", null, null, false);
                CoreWebView2Environment environment = await CoreWebView2Environment.CreateAsync(null, dataDirectory, options);
                await view.EnsureCoreWebView2Async(environment);
                view.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;
                view.CoreWebView2.Settings.AreDevToolsEnabled = false;
                view.CoreWebView2.SetVirtualHostNameToFolderMapping("solar-atlas.local", Path.Combine(installDirectory, "resources"), CoreWebView2HostResourceAccessKind.DenyCors);
                view.CoreWebView2.WebMessageReceived += ReceiveMessage;
                view.CoreWebView2.NavigationStarting += (s, e) => { if (!e.Uri.StartsWith("https://solar-atlas.local/", StringComparison.OrdinalIgnoreCase)) e.Cancel = true; };
                view.CoreWebView2.NewWindowRequested += (s, e) => { e.Handled = true; };
                view.CoreWebView2.Navigate("https://solar-atlas.local/index.html");
            } catch (Exception error) {
                MessageBox.Show("无法启动桌面版。请确认 Windows 已安装 Microsoft Edge WebView2 运行时。\n\n" + error.Message, "太阳系漫游模拟器", MessageBoxButtons.OK, MessageBoxIcon.Error);
                Close();
            }
        };
    }
    private void ToggleFullscreen()
    {
        if (fullscreen) {
            FormBorderStyle = FormBorderStyle.Sizable;
            WindowState = FormWindowState.Maximized;
            fullscreen = false;
        } else {
            Screen screen = Screen.FromControl(this);
            WindowState = FormWindowState.Normal;
            FormBorderStyle = FormBorderStyle.None;
            Bounds = screen.Bounds;
            fullscreen = true;
        }
        view.CoreWebView2.PostWebMessageAsString(fullscreen ? "FULLSCREEN|1" : "FULLSCREEN|0");
    }
    private void ReceiveMessage(object sender, CoreWebView2WebMessageReceivedEventArgs e)
    {
        if (!e.Source.StartsWith("https://solar-atlas.local/", StringComparison.OrdinalIgnoreCase)) return;
        string message;
        try { message = e.TryGetWebMessageAsString(); } catch { return; }
        if (message == "desktop:toggleFullscreen") { ToggleFullscreen(); return; }
        if (message == "desktop:exit") { Close(); return; }
        const string prefix = "screenshot:data:image/png;base64,";
        if (!message.StartsWith(prefix, StringComparison.Ordinal)) return;
        try {
            if (message.Length > 56 * 1024 * 1024) throw new InvalidDataException("截图超过大小限制");
            byte[] png = Convert.FromBase64String(message.Substring(prefix.Length));
            byte[] signature = { 137, 80, 78, 71, 13, 10, 26, 10 };
            if (png.Length < signature.Length) throw new InvalidDataException("PNG 数据不完整");
            for (int i = 0; i < signature.Length; i++) if (png[i] != signature[i]) throw new InvalidDataException("PNG 格式无效");
            string pictures = Environment.GetFolderPath(Environment.SpecialFolder.MyPictures);
            if (String.IsNullOrWhiteSpace(pictures)) pictures = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "SOLARIS");
            string folder = Path.Combine(pictures, "SOLARIS", "Screenshots");
            Directory.CreateDirectory(folder);
            string name = DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss-fff") + ".png";
            using (var file = new FileStream(Path.Combine(folder, name), FileMode.CreateNew, FileAccess.Write, FileShare.None)) file.Write(png, 0, png.Length);
            view.CoreWebView2.PostWebMessageAsString("OK|" + Path.Combine("Pictures", "SOLARIS", "Screenshots", name));
        } catch (Exception error) {
            view.CoreWebView2.PostWebMessageAsString("ERR|" + error.Message);
        }
    }
    [STAThread]
    private static void Main()
    {
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        Application.Run(new SolarAtlasWindow());
    }
}

