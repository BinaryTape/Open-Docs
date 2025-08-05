# 自適應佈局

為了在所有類型的裝置上提供一致的使用者體驗，請調整您應用程式的 UI 以適應不同的顯示尺寸、方向和輸入模式。

## 設計自適應佈局

設計自適應佈局時，請遵循以下關鍵指南：

*   優先使用 [典型佈局](https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts) 模式，例如列表-詳細、資訊流和輔助窗格。
*   透過重複使用邊距、排版和其他設計元素的共用樣式來保持一致性。在遵循平台特定指南的同時，保持跨裝置導覽模式的一致性。
*   將複雜佈局拆分為可重複使用的 Composable，以提高靈活性和模組化。
*   調整以適應螢幕密度和方向。

## 使用視窗大小類別

視窗大小類別是預定義閾值，也稱為斷點，它們將不同的螢幕尺寸分類，以幫助您設計、開發和測試自適應佈局。

視窗大小類別將應用程式可用的顯示區域分為寬度和高度的三個類別：compact、medium 和 expanded。當您進行佈局更改時，請測試所有視窗尺寸下的佈局行為，尤其是在不同的斷點閾值處。

若要使用 `WindowSizeClass` 類別，請將 `material3.adaptive` 依賴項新增到模組的 `build.gradle.kts` 檔案中的通用原始碼集：

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.compose.material3.adaptive:adaptive:%org.jetbrains.compose.material3.adaptive%")
}
```

`WindowSizeClass` API 允許您根據可用的顯示空間更改應用程式的佈局。例如，您可以根據視窗高度管理頂部應用程式列的可見性：

```kotlin
@Composable
fun MyApp(
    windowSizeClass: WindowSizeClass = currentWindowAdaptiveInfo().windowSizeClass
) {
    // 確定是否應顯示頂部應用程式列
    val showTopAppBar = windowSizeClass.isHeightAtLeastBreakpoint(WindowSizeClass.HEIGHT_DP_MEDIUM_LOWER_BOUND)

    // 使用列的可見性來定義 UI 
    MyScreen(
        showTopAppBar = showTopAppBar,
        /* ... */
    )
}
```

<!--- waiting for a page about @Preview and hot reload
## Previewing layouts

We have three different @Preview:

* Android-specific, for `androidMain`, from Android Studio.
* Separate desktop annotation plugin with our own implementation (only for desktop source set) + uiTooling plugin.
* Common annotation, also supported in Android Studio, works for Android only but from common code.
-->

## 下一步

在 [Jetpack Compose 文件](https://developer.android.com/develop/ui/compose/layouts/adaptive) 中了解更多關於自適應佈局的資訊。