---
title: "Kotlin Native"
---
Kotlin/Native 是一項將 Kotlin 程式碼編譯為可在沒有虛擬機器情況下執行的原生二進位檔的技術。
Kotlin/Native 包含一個基於 [LLVM](https://llvm.org/)-的 Kotlin 編譯器後端和 Kotlin 標準函式庫的原生實作。

## 為什麼要使用 Kotlin/Native？

Kotlin/Native 的主要設計目的是允許編譯到不希望或不可能使用 _虛擬機器 (virtual machines)_ 的平台，例如嵌入式裝置或 iOS。
當開發人員需要產生一個不需要額外執行階段或虛擬機器的獨立程式時，它是理想的選擇。

## 目標平台

Kotlin/Native 支援以下平台：
* macOS
* iOS、tvOS、watchOS
* Linux
* Windows (MinGW)
* Android NDK

:::note
要編譯 Apple 目標平台 (macOS、iOS、tvOS 和 watchOS)，您需要安裝 [Xcode](https://apps.apple.com/us/app/xcode/id497799835) 及其命令列工具。

:::

[查看完整支援目標平台清單](native-target-support)。

## 互通性 (Interoperability)

Kotlin/Native 支援與不同作業系統的原生程式設計語言進行雙向互通。
編譯器會建立：
* 適用於許多 [平台](#target-platforms) 的可執行檔
* 具有 C 標頭的靜態函式庫或 [動態 (dynamic)](native-dynamic-libraries) 函式庫，適用於 C/C++ 專案
* 適用於 Swift 和 Objective-C 專案的 [Apple framework](apple-framework)

Kotlin/Native 支援互通性，以便直接從 Kotlin/Native 使用現有函式庫：
* 靜態或動態 [C 函式庫](native-c-interop)
* C、[Swift 和 Objective-C](native-objc-interop) frameworks (框架)

可以輕鬆地將編譯後的 Kotlin 程式碼包含在以 C、C++、Swift、Objective-C 和其他語言編寫的現有專案中。
也可以輕鬆地直接從 Kotlin/Native 使用現有的原生程式碼、靜態或動態 [C 函式庫](native-c-interop)、Swift/Objective-C [frameworks (框架)](native-objc-interop)、圖形引擎以及任何其他內容。

Kotlin/Native [平台函式庫](native-platform-libs) 有助於在專案之間共享 Kotlin 程式碼。
POSIX、gzip、OpenGL、Metal、Foundation 和許多其他流行的函式庫和 Apple frameworks (框架) 已預先匯入，並作為 Kotlin/Native 函式庫包含在編譯器套件中。

## 在平台之間共享程式碼

[Kotlin Multiplatform](multiplatform-intro) 有助於在多個平台 (包括 Android、iOS、JVM、Web 和 native (原生)) 之間共享通用程式碼。Multiplatform 函式庫為通用 Kotlin 程式碼提供必要的 API，並允許在一個位置用 Kotlin 編寫專案的共享部分。

您可以使用 [建立您的 Kotlin Multiplatform 應用程式](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html) 教學課程來建立應用程式，並在 iOS 和 Android 之間共享業務邏輯。若要在 iOS、Android、桌面和 Web 之間共享 UI，請完成 [Compose Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html) 的教學課程，這是 JetBrains 基於 Kotlin 和 [Jetpack Compose](https://developer.android.com/jetpack/compose) 的宣告式 UI 框架。

## 如何開始

Kotlin 新手嗎？請查看 [Kotlin 入門](getting-started)。

建議的文件：

* [Kotlin Multiplatform 簡介](multiplatform-intro)
* [與 C 的互通性](native-c-interop)
* [與 Swift/Objective-C 的互通性](native-objc-interop)

建議的教學課程：

* [Kotlin/Native 入門](native-get-started)
* [建立您的 Kotlin Multiplatform 應用程式](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
* [從 C 映射基本資料類型](mapping-primitive-data-types-from-c)
* [Kotlin/Native 作為動態函式庫](native-dynamic-libraries)
* [Kotlin/Native 作為 Apple framework (框架)](apple-framework)