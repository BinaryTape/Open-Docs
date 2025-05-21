---
title: "Kotlin 開發的 IDE（整合開發環境）"
description: "JetBrains 為 IntelliJ IDEA 和 Android Studio 提供官方的 Kotlin IDE 支援。"
---
JetBrains 為下列 IDE（整合開發環境）和程式碼編輯器提供官方 Kotlin 支援：
[IntelliJ IDEA](#intellij-idea) 和 [Android Studio](#android-studio)。

其他 IDE 和程式碼編輯器僅有 Kotlin 社群支援的外掛程式 (plugin)。

## IntelliJ IDEA

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 是一款專為 JVM 語言（例如 Kotlin 和 Java）設計的 IDE，旨在最大限度地提高開發人員的生產力。
它透過提供智慧程式碼完成、靜態程式碼分析和重構，為您處理例行且重複的任務。
它讓您可以專注於軟體開發的光明面，使其不僅高效，而且是一種愉快的體驗。

Kotlin 外掛程式與每個 IntelliJ IDEA 版本捆綁在一起。
每個 IDEA 版本都會引入新功能和升級，從而改善 IDE 中 Kotlin 開發人員的體驗。
請參閱 [What's new in IntelliJ IDEA](https://www.jetbrains.com/idea/whatsnew/)，以了解 Kotlin 的最新更新和改進。

在[官方文件](https://www.jetbrains.com/help/idea/discover-intellij-idea.html)中閱讀有關 IntelliJ IDEA 的更多資訊。

## Android Studio

[Android Studio](https://developer.android.com/studio) 是 Android 應用程式開發的官方 IDE，基於 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
除了 IntelliJ 強大的程式碼編輯器和開發人員工具之外，Android Studio 還提供更多功能，可在您建構 Android 應用程式時提高您的生產力。

Kotlin 外掛程式與每個 Android Studio 版本捆綁在一起。

在[官方文件](https://developer.android.com/studio/intro)中閱讀有關 Android Studio 的更多資訊。

## Eclipse

[Eclipse](https://eclipseide.org/release/) 允許開發人員使用不同的程式語言（包括 Kotlin）來編寫其應用程式。
它還具有 Kotlin 外掛程式：最初由 JetBrains 開發，現在 Kotlin 外掛程式由 Kotlin 社群貢獻者支援。

您可以[從 Marketplace 手動安裝 Kotlin 外掛程式](https://marketplace.eclipse.org/content/kotlin-plugin-eclipse)。

Kotlin 團隊管理 Eclipse 的 Kotlin 外掛程式的開發和貢獻過程。
如果您想為此外掛程式做出貢獻，請將提取請求 (pull request) 送至其 [GitHub 上的儲存庫](https://github.com/Kotlin/kotlin-eclipse)。

## 與 Kotlin 語言版本的相容性

對於 IntelliJ IDEA 和 Android Studio，Kotlin 外掛程式與每個版本捆綁在一起。
發布新的 Kotlin 版本時，這些工具將建議自動將 Kotlin 更新到最新版本。
請參閱 [Kotlin releases](releases#ide-support) 中的最新支援語言版本。

## 其他 IDE 支援

JetBrains 不為其他 IDE 提供 Kotlin 外掛程式。
但是，其他一些 IDE 和原始碼編輯器（例如 Eclipse、Visual Studio Code 和 Atom）擁有 Kotlin 社群支援的自己的 Kotlin 外掛程式。

您可以使用任何文字編輯器來編寫 Kotlin 程式碼，但沒有 IDE 相關的功能：程式碼格式化、偵錯工具等等。
若要在文字編輯器中使用 Kotlin，您可以從 Kotlin [GitHub Releases](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20) 下載最新的 Kotlin 命令列編譯器 (`kotlin-compiler-2.1.20.zip`) 並[手動安裝它](command-line#manual-install)。
此外，您可以使用套件管理器，例如 [Homebrew](command-line#homebrew)、[SDKMAN!](command-line#sdkman) 和 [Snap package](command-line#snap-package)。

## 接下來做什麼？

* [使用 IntelliJ IDEA IDE 啟動您的第一個專案](jvm-get-started)
* [使用 Android Studio 建立您的第一個跨平台行動應用程式](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)