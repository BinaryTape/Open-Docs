[//]: # (title: 適用於 Kotlin 開發的 IDE)
[//]: # (description: JetBrains 為 IntelliJ IDEA 和 Android Studio 提供官方 Kotlin IDE 支援。)

JetBrains 為以下 IDE 和程式碼編輯器提供官方 Kotlin 支援：
[IntelliJ IDEA](#intellij-idea) 和 [Android Studio](#android-studio)。

其他 IDE 和程式碼編輯器僅有社群支援的 Kotlin 外掛程式。

## IntelliJ IDEA

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 是一款專為 JVM 語言（例如 Kotlin 和 Java）設計的 IDE，旨在最大限度地提高開發人員的生產力。
它透過提供智慧型程式碼補全、靜態程式碼分析和重構，為您處理日常和重複性的任務。
它讓您能夠專注於軟體開發的光明面，使其不僅高效，更是一種愉快的體驗。

Kotlin 外掛程式與每個 IntelliJ IDEA 版本捆綁在一起。
每個 IDEA 版本都引入了新功能和升級，改善了 Kotlin 開發人員在 IDE 中的體驗。
請參閱 [IntelliJ IDEA 的新功能](https://www.jetbrains.com/idea/whatsnew/) 以了解 Kotlin 的最新更新和改進。

請在 [官方文件](https://www.jetbrains.com/help/idea/discover-intellij-idea.html) 中閱讀更多關於 IntelliJ IDEA 的資訊。

## Android Studio

[Android Studio](https://developer.android.com/studio) 是基於 [IntelliJ IDEA](https://www.jetbrains.com/idea/) 的官方 Android 應用程式開發 IDE。
除了 IntelliJ 強大的程式碼編輯器和開發者工具之外，Android Studio 還提供了更多功能，可在開發 Android 應用程式時提高您的生產力。

Kotlin 外掛程式與每個 Android Studio 版本捆綁在一起。

請在 [官方文件](https://developer.android.com/studio/intro) 中閱讀更多關於 Android Studio 的資訊。

## Eclipse

[Eclipse](https://eclipseide.org/release/) 允許開發人員使用不同的程式語言（包括 Kotlin）編寫應用程式。它也有 Kotlin 外掛程式：最初由 JetBrains 開發，現在由 Kotlin 社群貢獻者支援。

您可以從 [Marketplace](https://marketplace.eclipse.org/content/kotlin-plugin-eclipse) 手動安裝 Kotlin 外掛程式。

Kotlin 團隊負責管理 Eclipse 的 Kotlin 外掛程式的開發和貢獻流程。
如果您想為該外掛程式做出貢獻，請將拉取請求 (pull request) 發送到其位於 [GitHub](https://github.com/Kotlin/kotlin-eclipse) 的儲存庫 (repository)。

## 與 Kotlin 語言版本的相容性

對於 IntelliJ IDEA 和 Android Studio，Kotlin 外掛程式與每個版本捆綁在一起。
當新的 Kotlin 版本發布時，這些工具將自動建議將 Kotlin 更新到最新版本。
請參閱 [Kotlin 版本](releases.md#ide-support) 中支援的最新語言版本。

## 其他 IDE 支援

JetBrains 不為其他 IDE 提供 Kotlin 外掛程式。
然而，一些其他 IDE 和原始碼編輯器，例如 Eclipse、Visual Studio Code 和 Atom，都有其自己的由 Kotlin 社群支援的 Kotlin 外掛程式。

您可以使用任何文字編輯器來編寫 Kotlin 程式碼，但沒有 IDE 相關功能：程式碼格式化、偵錯工具等等。
要在文字編輯器中使用 Kotlin，您可以從 Kotlin [GitHub 版本](%kotlinLatestUrl%) 下載最新的 Kotlin 命令列編譯器 (`kotlin-compiler-%kotlinVersion%.zip`) 並[手動安裝](command-line.md#manual-install)。
此外，您可以使用套件管理器 (package manager)，例如 [Homebrew](command-line.md#homebrew)、[SDKMAN!](command-line.md#sdkman) 和 [Snap package](command-line.md#snap-package)。

## 接下來做什麼？

*   [使用 IntelliJ IDEA IDE 啟動您的第一個專案](jvm-get-started.md)
*   [使用 Android Studio 建立您的第一個跨平台行動應用程式](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)