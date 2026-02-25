# 自適應配置

為在所有類型的裝置上提供一致的使用者體驗，請讓您的應用程式 UI 適應不同的顯示尺寸、螢幕方向和輸入模式。

## 設計自適應配置

設計自適應配置時，請遵循以下關鍵準則：

*   優先使用 [標準配置](https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts) 模式，例如清單-詳細資料 (list-detail)、動態時報 (feed) 和輔助面板 (supporting pane)。
*   透過重複使用間距 (padding)、字體排印 (typography) 和其他設計元素的共享樣式來保持一致性。在遵循平台特定指南的同時，讓不同裝置間的導覽模式保持一致。
*   將複雜的配置拆分為可重複使用的 composable，以提高彈性和模組化。
*   針對螢幕密度和方向進行調整。

## 使用視窗大小類別

視窗大小類別是預定義的閾值，也稱為中斷點 (breakpoint)，用於對不同的螢幕尺寸進行分類，以協助您設計、開發和測試自適應配置。

視窗大小類別將應用程式可用的顯示區域在寬度和高度上都分為三個類別：緊湊 (compact)、中等 (medium) 和擴展 (expanded)。當您進行配置變更時，請測試所有視窗大小下的配置行為，特別是在不同的中斷點閾值處。

若要使用 `WindowSizeClass` 類別，請將 `material3.adaptive` 相依性新增至模組 `build.gradle.kts` 檔案中的 common 原始碼集：

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.compose.material3.adaptive:adaptive:%org.jetbrains.compose.material3.adaptive%")
}
```

`WindowSizeClass` API 允許您根據可用的顯示空間來變更應用程式配置。例如，您可以根據視窗高度來管理頂部應用程式列的可見性：

```kotlin
@Composable
fun MyApp(
    windowSizeClass: WindowSizeClass = currentWindowAdaptiveInfo().windowSizeClass
) {
    // 決定是否應顯示頂部應用程式列
    val showTopAppBar = windowSizeClass.isHeightAtLeastBreakpoint(WindowSizeClass.HEIGHT_DP_MEDIUM_LOWER_BOUND)

    // 使用列的可見性來定義 UI 
    MyScreen(
        showTopAppBar = showTopAppBar,
        /* ... */
    )
}
```

<!--- waiting for a page about @Preview and hot reload
## 預覽配置

我們有三種不同的 @Preview：

* Android 特定，用於 `androidMain`，來自 Android Studio。
* 獨立的桌面註解外掛程式，具有我們自己的實作（僅限桌面原始碼集）+ uiTooling 外掛程式。
* 共用註解，Android Studio 也支援，僅適用於 Android，但來自共用程式碼。
-->

## 接續步驟

在 [Jetpack Compose 文件](https://developer.android.com/develop/ui/compose/layouts/adaptive) 中進一步了解自適應配置。