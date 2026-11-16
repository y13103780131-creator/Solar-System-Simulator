# Third-Party Notices

This file identifies third-party software and materials that are known to be
included or required by SOLARIS 1.0. It does not grant rights beyond the terms
published by each owner. Textures and images are listed separately in
`ASSET-SOURCES.md`; several legacy texture files still require source/license
verification before public redistribution.

## Three.js

- Component: `resources/assets/three.min.js`
- Version: r150 (version banner in the bundled file)
- Project: <https://github.com/mrdoob/three.js>
- License: MIT
- License text: <https://github.com/mrdoob/three.js/blob/r150/LICENSE>

Copyright (c) 2010-2023 three.js authors.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Microsoft Edge WebView2 SDK

- Components: `Microsoft.Web.WebView2.Core.dll`,
  `Microsoft.Web.WebView2.WinForms.dll`, and `WebView2Loader.dll`
- SDK assembly version: 1.0.864.35 (read from the bundled managed assemblies)
- Package and license: <https://www.nuget.org/packages/Microsoft.Web.WebView2/1.0.864.35>
- Owner: Microsoft Corporation

These binaries are Microsoft components and are not SOLARIS original code.
The exact NuGet license page for version 1.0.864.35 identifies a BSD 3-Clause
license. The required notice and disclaimer are reproduced below. The Evergreen
WebView2 Runtime itself is a system prerequisite and is not bundled by this
project.

Copyright (C) Microsoft Corporation. All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.
3. Neither the name of Microsoft Corporation nor the names of its contributors
   may be used to endorse or promote products derived from this software
   without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

## Microsoft .NET Framework and Windows

The application uses the .NET Framework and Windows APIs provided by the target
operating system. They are not copied into the portable or setup package by this
project and remain subject to Microsoft's terms.

## Inno Setup

Inno Setup is used only as a build tool and is not bundled with the application.
The generated installer and its uninstaller remain subject to the applicable
Inno Setup license and redistribution terms.

## Pending release verification

The current legacy asset directory contains textures whose exact original file
records and individual license terms have not all been verified. Do not treat
any third-party asset as public domain based only on its presence in this repo.
Resolve the entries marked unresolved in `ASSET-SOURCES.md` before making the
repository public or distributing the installer/portable archive.

