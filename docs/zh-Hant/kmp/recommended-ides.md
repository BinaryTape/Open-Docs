[//]: # (title: 推薦的 IDE 與程式碼編輯器)

## IntelliJ IDEA 與 Android Studio

[IntelliJ IDEA](https://www.jetbrains.com/idea/) 提供完整的 Kotlin Multiplatform 支援。
[Android Studio](https://developer.android.com/studio) 是另一個穩定的 Kotlin Multiplatform 解決方案。
由於兩者均建構於 IntelliJ 平台之上，它們通常共享相同的功能。
然而，特定更新可能不會同時發佈。

從 IntelliJ IDEA 2025.2.2 或 Android Studio Otter 2025.2.1 開始，
您可以安裝 [Kotlin Multiplatform 外掛程式](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)，
該外掛程式提供 iOS 應用程式的基本啟動與偵錯功能、
預檢環境檢查以及其他有用的 KMP 功能性。

除了基礎的 Kotlin Multiplatform 特性外，該外掛程式還支援 Compose Multiplatform
庫，從而實現更舒適的 UI 開發：

* 提升開發效率的多平台資源自動化功能。
* 支援可在通用 Compose 程式碼中運作的 `@Preview` 註解。
* 支援 [Compose Hot Reload](compose-hot-reload.md)，包括自動偵測熱重載執行配置、
  整合日誌與設定的 IDE 整合，以及
  量身定制的 IDE 操作與工具列，讓整體體驗更加流暢。

## Xcode

如果您在 Kotlin Multiplatform 專案中的目標平台包含 iOS，則需要在電腦上安裝 [Xcode](https://developer.apple.com/xcode/)，
以便編寫 iOS 特定程式碼並執行 iOS 應用程式。

若要將您的應用程式上傳至 App Store Connect，請使用 Xcode 16 或更高版本進行組建。

## 其他 IDE 與程式碼編輯器

如果基本的 Kotlin Multiplatform 支援對您而言已經足夠，您可以使用任何支援 Kotlin 的 IDE。