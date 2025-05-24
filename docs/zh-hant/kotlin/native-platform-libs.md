---
title: "平台函式庫 (Platform libraries)"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

為了提供對作業系統原生服務的存取，Kotlin/Native 發行版包含一組針對每個目標特定的預建函式庫。 這些被稱為 _平台函式庫 (platform libraries)_。

預設情況下，平台函式庫中的套件可用。 您無需指定額外的連結選項即可使用它們。 Kotlin/Native 編譯器會自動檢測存取了哪些平台函式庫，並連結必要的函式庫。

然而，編譯器發行版中的平台函式庫僅僅是原生函式庫的封裝 (wrapper) 和綁定 (binding)。 這意味著您需要在本機安裝原生函式庫本身（`.so`、`.a`、`.dylib`、`.dll` 等）。

## POSIX 綁定 (bindings)

Kotlin 為所有基於 UNIX 和 Windows 的目標（包括 Android 和 iOS）提供 POSIX 平台函式庫。 這些平台函式庫包含對平台實作的綁定，該實作遵循 [POSIX 標準](https://en.wikipedia.org/wiki/POSIX)。

要使用該函式庫，請將其匯入到您的專案中：

```kotlin
import platform.posix.*
```

:::note
`platform.posix` 的內容在不同平台之間有所不同，因為 POSIX 實作存在差異。

:::

您可以在此處瀏覽每個支援平台的 `posix.def` 檔案的內容：

* [iOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/ios/posix.def)
* [macOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/osx/posix.def)
* [tvOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/tvos/posix.def)
* [watchOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/watchos/posix.def)
* [Linux](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/linux/posix.def)
* [Windows (MinGW)](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/mingw/posix.def)
* [Android](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/android/posix.def)

POSIX 平台函式庫不適用於 [WebAssembly](wasm-overview) 目標。

## 流行的原生函式庫 (Popular native libraries)

Kotlin/Native 為各種流行的原生函式庫提供綁定，這些函式庫通常在不同的平台上使用，例如 OpenGL、zlib 和 Foundation。

在 Apple 平台上，包含 `objc` 函式庫以啟用與 [Objective-C 的互操作性 (interoperability)](native-objc-interop) API。

您可以根據您的設定，在編譯器發行版中瀏覽適用於 Kotlin/Native 目標的原生函式庫：

* 如果您[安裝了獨立的 Kotlin/Native 編譯器](native-get-started#download-and-install-the-compiler)：

  1. 前往包含編譯器發行版的解壓縮封存檔，例如 `kotlin-native-prebuilt-macos-aarch64-2.1.0`。
  2. 導覽至 `klib/platform` 目錄。
  3. 選擇具有相應目標的資料夾。

* 如果您在 IDE 中使用 Kotlin 外掛程式（與 IntelliJ IDEA 和 Android Studio 捆綁在一起）：

  1. 在您的命令行工具中，運行以下命令以導覽至 `.konan` 資料夾：

     <Tabs>
     <TabItem value="macOS and Linux" label="macOS and Linux">

     ```none
     ~/.konan/
     ```

     </TabItem>
     <TabItem value="Windows" label="Windows">

     ```none
     %\USERPROFILE%\.konan
     ```

     </TabItem>
     </Tabs>

  2. 開啟 Kotlin/Native 編譯器發行版，例如 `kotlin-native-prebuilt-macos-aarch64-2.1.0`。
  3. 導覽至 `klib/platform` 目錄。
  4. 選擇具有相應目標的資料夾。

:::tip
如果您想瀏覽每個支援的平台函式庫的定義檔案：在編譯器發行版資料夾中，導覽至 `konan/platformDef` 目錄並選擇必要的目標。

:::

## 接下來做什麼

[了解更多關於與 Swift/Objective-C 的互操作性 (interoperability)](native-objc-interop)