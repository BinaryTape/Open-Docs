[//]: # (title: Kotlin/Native)

Kotlin/Native 是一項將 Kotlin 程式碼編譯為原生二進制檔的技術，使其可以在不需要虛擬機的情況下執行。
Kotlin/Native 包含一個以 [LLVM](https://llvm.org/) 為基礎的 Kotlin 編譯器後端，以及 Kotlin 標準函式庫的原生實作。

## 為什麼選擇 Kotlin/Native？

Kotlin/Native 的主要設計目的是為了讓程式碼能在不適合或無法使用虛擬機的平台（例如嵌入式裝置或 iOS）上進行編譯。當你需要產生一個不依賴額外執行階段或虛擬機的獨立程式時，它是理想的選擇。

在現有的 C、C++、Swift、Objective-C 或其他語言撰寫的專案中，可以輕鬆地納入編譯後的 Kotlin 程式碼。你也可以直接在 Kotlin/Native 中使用現有的原生程式碼、靜態或動態 C 程式庫、Swift/Objective-C 框架、圖形引擎以及任何其他內容。

<a href="native-get-started.md"><img src="native-get-started-button.svg" width="350" alt="開始使用 Kotlin/Native" style="block"/></a>

## 目標平台

Kotlin/Native 支援以下平台：

* Linux
* Windows (透過 [MinGW](https://www.mingw-w64.org/))
* [Android NDK](https://developer.android.com/ndk)
* 適用於 macOS、iOS、tvOS 與 watchOS 的 Apple 目標

  > 若要編譯 Apple 目標，你需要安裝 [Xcode](https://apps.apple.com/us/app/xcode/id497799835) 及其命令列工具。
  >
  {style="note"}

[參閱完整的受支援目標與主機列表](native-target-support.md)。

## 互通性

Kotlin/Native 支援與不同作業系統的原生程式語言之間的雙向互通性。編譯器可以為許多平台建立可執行檔、靜態或動態 C 程式庫，以及 Swift/Objective-C 框架。

### 與 C 的互通性

Kotlin/Native 提供 [與 C 的互通性](native-c-interop.md)。你可以直接在 Kotlin 程式碼中使用現有的 C 程式庫。

若要了解更多資訊，請完成以下教學：

* [為 C/C++ 專案建立包含 C 標頭的動態程式庫](native-dynamic-libraries.md)
* [了解 C 型別如何對應至 Kotlin](mapping-primitive-data-types-from-c.md)
* [使用 C 互通性與 libcurl 建立原生 HTTP 用戶端](native-app-with-c-and-libcurl.md)

### 與 Swift/Objective-C 的互通性

Kotlin/Native 提供 [透過 Objective-C 與 Swift 的互通性](native-objc-interop.md)。你可以在 macOS 和 iOS 的 Swift/Objective-C 應用程式中直接使用 Kotlin 程式碼。

若要了解更多資訊，請完成 [Kotlin/Native 作為 Apple 框架](apple-framework.md) 教學。

## 在平台間共享程式碼

Kotlin/Native 包含一組預先建置的 [平台程式庫](native-platform-libs.md)，有助於在專案之間共享 Kotlin 程式碼。POSIX、gzip、OpenGL、Metal、Foundation 以及許多其他熱門程式庫與 Apple 框架都已預先匯入，並作為 Kotlin/Native 程式庫包含在編譯器套件中。

Kotlin/Native 是 [Kotlin 多平台](https://kotlinlang.org/docs/multiplatform/get-started.html) 技術的一部分，該技術有助於在多個平台（包括 Android、iOS、JVM、Web 和原生平台）之間共享通用程式碼。多平台程式庫為通用 Kotlin 程式碼提供了必要的 API，並允許在一個地方以 Kotlin 撰寫專案的共享部分。

## 記憶體管理員

Kotlin/Native 使用與 JVM 和 Go 類似的自動 [記憶體管理員](native-memory-manager.md)。它擁有自己的追蹤式垃圾收集器，該收集器也與 Swift/Objective-C 的 ARC 整合。

記憶體消耗由自訂記憶體分配器控制。它會最佳化記憶體使用量，並有助於防止記憶體分配突然激增。