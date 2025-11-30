[//]: # (title: Kotlin/Native)

Kotlin/Native 是一種技術，用於將 Kotlin 程式碼編譯為無需虛擬機器即可執行的原生二進位檔。
Kotlin/Native 包含一個基於 [LLVM](https://llvm.org/) 的 Kotlin 編譯器後端，以及 Kotlin 標準函式庫的原生實作。

## 為什麼選擇 Kotlin/Native？

Kotlin/Native 主要設計用於允許針對虛擬機器不適用或不可行的平台進行編譯，例如嵌入式裝置或 iOS。當您需要產生一個無需額外執行時環境或虛擬機器的自包含程式時，它是理想的選擇。

將編譯後的 Kotlin 程式碼整合到以 C、C++、Swift、Objective-C 和其他語言編寫的現有專案中非常容易。您也可以直接從 Kotlin/Native 中使用現有的原生程式碼、靜態或動態 C 函式庫、Swift/Objective-C 框架、圖形引擎以及任何其他內容。

<a href="native-get-started.md"><img src="native-get-started-button.svg" width="350" alt="開始使用 Kotlin/Native" style="block"/></a>

## 目標平台

Kotlin/Native 支援以下平台：

*   Linux
*   Windows（透過 [MinGW](https://www.mingw-w64.org/)）
*   [Android NDK](https://developer.android.com/ndk)
*   適用於 macOS、iOS、tvOS 和 watchOS 的 Apple 目標

  > 若要編譯 Apple 目標，您需要安裝 [Xcode](https://apps.apple.com/us/app/xcode/id497799835) 及其命令列工具。
  >
  {style="note"}

[查看支援目標和主機的完整列表](native-target-support.md)。

## 互通性

Kotlin/Native 支援與不同作業系統的原生程式語言雙向互通。編譯器可以為許多平台建立執行檔、靜態或動態 C 函式庫，以及 Swift/Objective-C 框架。

### 與 C 的互通性

Kotlin/Native 提供[與 C 的互通性](native-c-interop.md)。您可以直接從 Kotlin 程式碼中使用現有的 C 函式庫。

若要了解更多，請完成以下教學：

*   [為 C/C++ 專案建立帶有 C 標頭的動態函式庫](native-dynamic-libraries.md)
*   [了解 C 型別如何映射到 Kotlin](mapping-primitive-data-types-from-c.md)
*   [使用 C 互通性和 libcurl 建立原生 HTTP 用戶端](native-app-with-c-and-libcurl.md)

### 與 Swift/Objective-C 的互通性

Kotlin/Native 提供[透過 Objective-C 與 Swift 的互通性](native-objc-interop.md)。您可以直接從 macOS 和 iOS 上的 Swift/Objective-C 應用程式中使用 Kotlin 程式碼。

若要了解更多，請完成[Kotlin/Native 作為 Apple 框架](apple-framework.md)教學。

## 跨平台共用程式碼

Kotlin/Native 包含一套預建置的[平台函式庫](native-platform-libs.md)，有助於在專案之間共用 Kotlin 程式碼。POSIX、gzip、OpenGL、Metal、Foundation 和許多其他流行的函式庫和 Apple 框架都已預先匯入並作為 Kotlin/Native 函式庫包含在編譯器套件中。

Kotlin/Native 是 [Kotlin 多平台](https://kotlinlang.org/docs/multiplatform/get-started.html)技術的一部分，該技術有助於在多個平台之間共用通用程式碼，包括 Android、iOS、JVM、網頁和原生。多平台函式庫為通用 Kotlin 程式碼提供必要的 API，並允許在一個地方用 Kotlin 編寫專案的共用部分。

## 記憶體管理員

Kotlin/Native 使用與 JVM 和 Go 類似的自動[記憶體管理員](native-memory-manager.md)。它擁有自己的追蹤式垃圾收集器，該收集器也與 Swift/Objective-C 的 ARC 整合。

記憶體消耗由客製化記憶體配置器控制。它優化記憶體使用並協助防止記憶體配置的突然激增。