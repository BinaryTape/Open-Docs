[//]: # (title: 兼容性與版本)

Compose Multiplatform 的版本發佈與 Kotlin 和 Jetpack Compose 的版本發佈是分開的。此頁面包含有關 Compose Multiplatform 版本、Compose 發佈週期以及組件兼容性的資訊。

## 支援的平台

Compose Multiplatform %org.jetbrains.compose% 支援以下平台：

| 平台    | 最低版本                                                                                         |
|---------|----------------------------------------------------------------------------------------------------------|
| Android | Android 5.0 (API 等級 21)                                                                              |
| iOS     | iOS 13                                                                                                   |
| macOS   | macOS 12 x64, macOS 13 arm64                                                                             |
| Windows | Windows 10 (x86-64, arm64)                                                                               |
| Linux   | Ubuntu 20.04 (x86-64, arm64)                                                                             |
| Web     | 支援 [WasmGC](https://kotlinlang.org/docs/wasm-troubleshooting.html#browser-versions) 的瀏覽器 |

[//]: # (https://youtrack.jetbrains.com/issue/CMP-7539)

> 所有 Compose Multiplatform 版本僅支援 64 位元平台。
>
{style="note"}

## Kotlin 兼容性

最新版本的 Compose Multiplatform 始終與最新版本的 Kotlin 兼容。無需手動對齊它們的版本。請記住，使用任一產品的 EAP 版本仍可能不穩定。

Compose Multiplatform 要求套用與 Kotlin Multiplatform 外掛程式版本相同的 Compose Compiler Gradle 外掛程式。詳情請參閱 [undefined](compose-compiler.md#migrating-a-compose-multiplatform-project)。

> 從 Compose Multiplatform 1.8.0 開始，UI 框架已完全過渡到 K2 編譯器。因此，要使用最新的 Compose Multiplatform 版本，您應該：
> * 您的專案至少使用 Kotlin 2.1.0，
> * 僅當基於 Compose Multiplatform 的函式庫至少以 Kotlin 2.1.0 編譯時，才依賴這些函式庫。
>
> 作為向後兼容性問題的變通方法，直到您的所有依賴項都更新為止，您可以將 `kotlin.native.cacheKind=none` 新增到您的 `gradle.properties` 檔案中以關閉 Gradle 快取。這會增加編譯時間。
>
{style="warning"}

## 適用於桌面版 Compose Multiplatform 的限制

桌面版 Compose Multiplatform 具有以下限制：

*   由於 [Skia](https://skia.org/) 綁定中使用的記憶體管理方案，僅支援 JDK 11 或更高版本。
*   由於 [`jpackage`](https://docs.oracle.com/en/java/javase/17/docs/specs/man/jpackage.html) 的限制，僅支援 JDK 17 或更高版本用於打包原生發佈。
*   當在 macOS 上切換鍵盤佈局時，OpenJDK 11.0.12 存在一個已知 [問題](https://github.com/JetBrains/compose-multiplatform/issues/940)。此問題在 OpenJDK 11.0.15 中無法重現。

## Jetpack Compose 與 Compose Multiplatform 發佈週期

Compose Multiplatform 與 Google 開發的 Android 框架 [Jetpack Compose](https://developer.android.com/jetpack/compose) 共享大量程式碼。我們將 Compose Multiplatform 的發佈週期與 Jetpack Compose 的發佈週期對齊，以便共同程式碼得到適當的測試和穩定。

當 Jetpack Compose 的新版本發佈時，我們會：

*   使用該發佈提交作為下一個 [Compose Multiplatform](https://github.com/JetBrains/androidx) 版本的基礎。
*   新增對新平台功能的支援。
*   穩定所有平台。
*   發佈新版本的 Compose Multiplatform。

Compose Multiplatform 發佈與 Jetpack Compose 發佈之間的間隔通常為 1-3 個月。

### Compose Multiplatform 的開發版本

Compose Multiplatform 編譯器外掛程式的開發版本（例如 `1.8.2+dev2544`）是無固定排程建置的，用於測試正式版本之間的更新。

這些建置在 [Maven Central](https://central.sonatype.com/) 中不可用。要存取它們，請將此行新增到您的儲存庫列表中：

```kotlin
maven("https://maven.pkg.jetbrains.space/public/p/compose/dev")
```

### 使用的 Jetpack Compose Artifacts

當您為 Android 建置應用程式時，Compose Multiplatform 會使用 Google 發佈的 Artifacts。例如，如果您應用 Compose Multiplatform 1.5.0 Gradle 外掛程式並將 `implementation(compose.material3)` 新增到您的 `dependencies` 中，那麼您的專案將在 Android 目標中使用 `androidx.compose.material3:material3:1.1.1` Artifact（但在其他目標中則使用 `org.jetbrains.compose.material3:material3:1.5.0`）。

下表列出了每個 Compose Multiplatform 版本使用的 Jetpack Compose Artifact 版本：

| Compose Multiplatform 版本                                                      | Jetpack Compose 版本 | Jetpack Compose Material3 版本 |
|-------------------------------------------------------------------------------------|--------------------------|------------------------------------|
| [1.8.2](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.8.2)   | 1.8.2                    | 1.3.2                              |
| [1.7.3](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.7.3)   | 1.7.6                    | 1.3.1                              |
| [1.7.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.7.1)   | 1.7.5                    | 1.3.1                              |
| [1.7.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.7.0)   | 1.7.1                    | 1.3.0                              |
| [1.6.11](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.6.11) | 1.6.7                    | 1.2.1                              |
| [1.6.10](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.6.10) | 1.6.7                    | 1.2.1                              |
| [1.6.2](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.6.2)   | 1.6.4                    | 1.2.1                              |
| [1.6.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.6.1)   | 1.6.3                    | 1.2.1                              |
| [1.6.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.6.0)   | 1.6.1                    | 1.2.0                              |
| [1.5.12](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.5.12) | 1.5.4                    | 1.1.2                              |
| [1.5.11](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.5.11) | 1.5.4                    | 1.1.2                              |
| [1.5.10](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.5.10) | 1.5.4                    | 1.1.2                              |
| [1.5.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.5.1)   | 1.5.0                    | 1.1.1                              |
| [1.5.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.5.0)   | 1.5.0                    | 1.1.1                              |
| [1.4.3](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.4.3)   | 1.4.3                    | 1.0.1                              |
| [1.4.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.4.1)   | 1.4.3                    | 1.0.1                              |
| [1.4.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.4.0)   | 1.4.0                    | 1.0.1                              |
| [1.3.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.3.1)   | 1.3.3                    | 1.0.1                              |
| [1.3.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.3.0)   | 1.3.3                    | 1.0.1                              |
| [1.2.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.2.1)   | 1.2.1                    | 1.0.0-alpha14                      |
| [1.2.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.2.0)   | 1.2.1                    | 1.0.0-alpha14                      |
| [1.1.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.1.1)   | 1.1.0                    | 1.0.0-alpha05                      |
| [1.1.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.1.0)   | 1.1.0                    | 1.0.0-alpha05                      |
| [1.0.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.0.1)   | 1.1.0-beta02             | 1.0.0-alpha03                      |
| [1.0.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.0.0)   | 1.1.0-beta02             | 1.0.0-alpha03                      |