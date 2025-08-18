# 自適應佈局

為了在所有類型的裝置上提供一致的使用者體驗，請將您應用程式的 UI 調整為不同的顯示尺寸、方向和輸入模式。

## 設計自適應佈局

設計自適應佈局時，請遵循以下主要準則：

* 優先選擇 [典範佈局](https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts) 模式，例如清單-詳細資訊、訊息流和輔助窗格。
* 透過重複使用共用樣式（如邊距、排版和其他設計元素）來保持一致性。在遵循平台特定準則的同時，在不同裝置上保持導覽模式一致。
* 將複雜的佈局分解為可重複使用的 composable，以提高彈性和模組化。
* 調整螢幕密度和方向。

## 使用視窗尺寸類別

視窗尺寸類別是預定義的閾值，也稱為斷點，用於分類不同的螢幕尺寸，幫助您設計、開發和測試自適應佈局。

視窗尺寸類別將您應用程式可用的顯示區域分為寬度和高度的三個類別：`compact`、`medium` 和 `expanded`。當您進行佈局變更時，請測試所有視窗尺寸下的佈局行為，特別是在不同的斷點閾值處。

要使用 `WindowSizeClass` 類別，請將 `material3.adaptive` 依賴項新增到您模組的 `build.gradle.kts` 檔案中的 `commonMain` 原始碼集中：

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.compose.material3.adaptive:adaptive:%org.jetbrains.compose.material3.adaptive%")
}
```

`WindowSizeClass` API 允許您根據可用的顯示空間變更應用程式的佈局。例如，您可以根據視窗高度管理頂部應用程式列的顯示狀態：

```kotlin
@Composable
fun MyApp(
    windowSizeClass: WindowSizeClass = currentWindowAdaptiveInfo().windowSizeClass
) {
    // 判斷是否應顯示頂部應用程式列
    val showTopAppBar = windowSizeClass.isHeightAtLeastBreakpoint(WindowSizeClass.HEIGHT_DP_MEDIUM_LOWER_BOUND)

    // 使用列的顯示狀態來定義 UI 
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

## 接下來

在 [Jetpack Compose 文件](https://developer.android.com/develop/ui/compose/layouts/adaptive) 中了解更多關於自適應佈局的資訊。