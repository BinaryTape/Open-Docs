[//]: # (title: 平台函式庫)

為了提供對作業系統原生服務的存取，Kotlin/Native 發行版包含一組針對每個目標平台預建的函式庫。這些函式庫稱為 _平台函式庫_。

平台函式庫中的套件預設為可用。您無需指定額外的連結選項即可使用它們。Kotlin/Native 編譯器會自動偵測哪些平台函式庫被存取，並連結必要的函式庫。

然而，編譯器發行版中的平台函式庫僅是原生函式庫的封裝器和繫結。這表示您需要在本機上安裝原生函式庫本身 (例如 `.so`、`.a`、`.dylib`、`.dll` 等)。

## POSIX 繫結

Kotlin 為所有基於 UNIX 和 Windows 的目標平台 (包括 Android 和 iOS) 提供了 POSIX 平台函式庫。這些平台函式庫包含對平台實作的繫結，而這些實作遵循 [POSIX 標準](https://en.wikipedia.org/wiki/POSIX)。

若要使用該函式庫，請將其匯入您的專案中：

```kotlin
import platform.posix.*
```

> `platform.posix` 的內容會因 POSIX 實作的差異而有所不同。
>
{style="note"}

您可以在此處探索每個支援平台 `posix.def` 檔案的內容：

*   [iOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/ios/posix.def)
*   [macOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/osx/posix.def)
*   [tvOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/tvos/posix.def)
*   [watchOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/watchos/posix.def)
*   [Linux](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/linux/posix.def)
*   [Windows (MinGW)](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/mingw/posix.def)
*   [Android](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/android/posix.def)

POSIX 平台函式庫不適用於 [WebAssembly](wasm-overview.md) 目標平台。

## 常見原生函式庫

Kotlin/Native 為各種常見的原生函式庫提供了繫結，這些函式庫常用於不同的平台，例如 OpenGL、zlib 和 Foundation。

在 Apple 平台上，`objc` 函式庫已包含在內，以啟用與 [Objective-C API 的互通性](native-objc-interop.md)。

您可以根據您的設定，在編譯器發行版中探索適用於 Kotlin/Native 目標平台的原生函式庫：

*   如果您 [安裝了獨立式 Kotlin/Native 編譯器](native-get-started.md#download-and-install-the-compiler)：

    1.  前往解壓縮後的編譯器發行版壓縮檔，例如 `kotlin-native-prebuilt-macos-aarch64-2.1.0`。
    2.  導航到 `klib/platform` 目錄。
    3.  選擇包含對應目標平台的資料夾。

*   如果您在 IDE 中使用 Kotlin 外掛程式 (與 IntelliJ IDEA 和 Android Studio 捆綁)：

    1.  在您的命令列工具中，執行以下操作以導航到 `.konan` 資料夾：

        <tabs>
        <tab title="macOS 和 Linux">

        ```none
        ~/.konan/
        ```

        </tab>
        <tab title="Windows">

        ```none
        %\USERPROFILE%\.konan
        ```

        </tab>
        </tabs>

    2.  打開 Kotlin/Native 編譯器發行版，例如 `kotlin-native-prebuilt-macos-aarch64-2.1.0`。
    3.  導航到 `klib/platform` 目錄。
    4.  選擇包含對應目標平台的資料夾。

> 如果您想探索每個支援平台函式庫的定義檔：在編譯器發行版資料夾中，導航到 `konan/platformDef` 目錄並選擇必要的目標平台。
> 
{style="tip"}

## 後續步驟

[了解更多關於與 Swift/Objective-C 的互通性](native-objc-interop.md)