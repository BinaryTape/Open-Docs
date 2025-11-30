# 多平台 Jetpack 函式庫的封裝方式

Compose Multiplatform 將 Jetpack Compose 及其相關的 AndroidX 函式庫的全部功能帶到 Android 以外的其他平台。如 [Android Developers 網站](https://developer.android.com/kotlin/multiplatform) 所示，許多 Jetpack 函式庫（例如 `androidx.annotation`）由 Android 團隊以完全多平台的形式發布，並可直接在 KMP 專案中使用。其他函式庫，例如 Compose 本身、Navigation、Lifecycle 和 ViewModel，則需要額外支援才能在共通程式碼中運作。

JetBrains 的 Compose Multiplatform 團隊為這類函式庫在 Android 以外的平台產生成品，然後將它們與原始 Android 成品一起以單一群組 ID 發布。這樣一來，當您將此類多平台依賴項新增至您的共通原始碼集時，應用程式的 Android 發行版將使用 Android 成品。同時，其他目標平台的發行版則使用為相應平台建置的成品。

以下是此過程的概述：

![](androidx-cmp-artifacts.svg)

例如，「適用於 iOS 的 Navigation 成品」指的是以下多平台成品的集合：
* `org.jetbrains.androidx.navigation.navigation-compose-uikitarm64`
* `org.jetbrains.androidx.navigation.navigation-compose-uikitsimarm64`
* `org.jetbrains.androidx.navigation.navigation-common-iosx64`
* `org.jetbrains.androidx.navigation.navigation-runtime-iossimulatorarm64`
* 等等。

所有這些成品，連同其他平台的成品以及對原始 Android 函式庫 (`androidx.navigation.navigation-compose`) 的參考，都以群組形式發布。它們可透過統一的 `org.jetbrains.androidx.navigation.navigation-compose` 依賴項來存取。Compose Multiplatform Gradle 外掛程式負責處理平台專用成品與發行版之間的映射。

透過這種方法，包含該依賴項的 Kotlin 多平台 (KMP) 專案所產生的 Android 應用程式將使用原始的 Android Navigation 函式庫。另一方面，iOS 應用程式則使用由 JetBrains 建置的相應 iOS 函式庫。

## 適用於多平台專案的 Compose 套件

在基礎 Compose 函式庫中，最基本的 `androidx.compose.runtime` 是完全多平台的。
（[先前使用的](whats-new-compose-190.md#multiplatform-targets-in-androidx-compose-runtime-runtime) `org.jetbrains.compose.runtime` 成品現在作為別名。）
此外，Compose Multiplatform 實作了：
* `androidx.compose.ui` 和 `androidx.compose.foundation` 的多平台版本，它們在 Compose Multiplatform 專案中以 `org.jetbrains.compose.ui` 和 `org.jetbrains.compose.foundation` 的形式提供。
* `androidx.compose.material3` 和 `androidx.compose.material` 的多平台版本，它們也以類似方式封裝（`org.jetbrains.compose.material3` 和 `org.jetbrains.compose.material`）。與其他函式庫不同，Material 3 函式庫未與 Compose Multiplatform 版本耦合。因此，您可以提供直接依賴項，而不是 `material3` 別名。例如，您可以使用 EAP 版本。
* Material 3 adaptive 函式庫作為獨立成品（`org.jetbrains.compose.material3.adaptive:adaptive*`）

## 其他多平台函式庫

一些建置 Compose 應用程式所需的功能不在 AndroidX 的範疇內，因此 JetBrains 將其作為與 Compose Multiplatform 捆綁的多平台函式庫來實作，例如：

* Compose Multiplatform Gradle 外掛程式，它：
    * 提供用於配置 Compose Multiplatform 專案的 Gradle DSL。
    * 協助為桌面和 Web 目標建立發行套件。
    * 支援多平台資源函式庫，以確保資源為每個目標正確可用。
* `org.jetbrains.compose.components.resources`，它提供對 [跨平台資源](compose-multiplatform-resources.md) 的支援。
* `org.jetbrains.compose.components.uiToolingPreview`，它支援 IntelliJ IDEA 和 Android Studio 中共通程式碼的 Compose UI 預覽。
* `org.jetbrains.compose.components.animatedimage`，它支援顯示動畫影像。
* `org.jetbrains.compose.components.splitpane`，它實作了 Swing 的 [JSplitPane](https://docs.oracle.com/javase/8/docs/api/javax/swing/JSplitPane.html) 的類似物。