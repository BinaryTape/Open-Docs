[//]: # (title: Kotlin/Native)

Kotlin/Native 是一種技術，用於將 Kotlin 程式碼編譯為原生二進位檔，使其無需虛擬機器即可執行。Kotlin/Native 包含一個基於 [LLVM](https://llvm.org/) 的 Kotlin 編譯器後端，以及 Kotlin 標準函式庫的原生實作。

## 為何選擇 Kotlin/Native？

Kotlin/Native 主要設計目的，是為了讓程式碼能夠編譯到不適合或無法使用_虛擬機器_的平台，例如嵌入式裝置或 iOS。它非常適合您需要產生不需要額外執行時環境或虛擬機器的獨立程式的情況。

輕易地將編譯過的 Kotlin 程式碼納入用 C、C++、Swift、Objective-C 和其他語言寫成的現有專案。您也可以直接從 Kotlin/Native 使用現有的原生程式碼、靜態或動態 C 函式庫、Swift/Objective-C 框架、圖形引擎以及任何其他項目。

<a href="native-get-started.md"><img src="native-get-started-button.svg" width="350" alt="Get started with Kotlin/Native" style="block"/></a>

## 目標平台

Kotlin/Native 支援以下平台：

* Linux
* Windows（透過 [MinGW](https://www.mingw-w64.org/)）
* [Android NDK](https://developer.android.com/ndk)
* macOS、iOS、tvOS 和 watchOS 的 Apple 目標

  > 為了編譯 Apple 目標，您需要安裝 [Xcode](https://apps.apple.com/us/app/xcode/id497799835) 及其命令列工具。
  >
  {style="note"}

[查看支援目標的完整列表](native-target-support.md)。

## 互通性

Kotlin/Native 支援與不同作業系統的原生程式語言進行雙向互通。編譯器可以為多個平台建立可執行檔、靜態或動態 C 函式庫，以及 Swift/Objective-C 框架。

### 與 C 的互通性

Kotlin/Native 提供[與 C 的互通性](native-c-interop.md)。您可以直接從 Kotlin 程式碼使用現有的 C 函式庫。

若要了解更多資訊，請完成以下教學：

* [為 C/C++ 專案建立帶有 C 標頭檔的動態函式庫](native-dynamic-libraries.md)
* [了解 C 類型如何對應到 Kotlin](mapping-primitive-data-types-from-c.md)
* [使用 C 互通和 libcurl 建立原生 HTTP 用戶端](native-app-with-c-and-libcurl.md)

### 與 Swift/Objective-C 的互通性

Kotlin/Native 提供[透過 Objective-C 與 Swift 的互通性](native-objc-interop.md)。您可以在 macOS 和 iOS 上直接從 Swift/Objective-C 應用程式使用 Kotlin 程式碼。

若要了解更多資訊，請完成[Kotlin/Native 作為 Apple 框架](apple-framework.md)教學。

## 跨平台程式碼共享

Kotlin/Native 包含一組預建的[平台函式庫](native-platform-libs.md)，有助於在專案間共享 Kotlin 程式碼。POSIX、gzip、OpenGL、Metal、Foundation 以及許多其他常用的函式庫和 Apple 框架都已預先匯入，並以 Kotlin/Native 函式庫的形式包含在編譯器套件中。

Kotlin/Native 是 [Kotlin 多平台](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)技術的一部分，有助於在包括 Android、iOS、JVM、網頁和原生在內的多個平台上共享常用程式碼。多平台函式庫為常用 Kotlin 程式碼提供了必要的 API，並允許在同一處用 Kotlin 編寫專案的共享部分。

## 記憶體管理器

Kotlin/Native 使用類似於 JVM 和 Go 的自動[記憶體管理器](native-memory-manager.md)。它擁有自己的追蹤垃圾回收器，該回收器也與 Swift/Objective-C 的 ARC 整合。

記憶體消耗由自訂記憶體分配器控制。它優化了記憶體使用，並有助於防止記憶體分配的突然激增。