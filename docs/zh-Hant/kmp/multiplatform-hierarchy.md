[//]: # (title: 專案的階層式結構)

Kotlin 多平台專案支援分層原始碼集結構。這表示您可以安排中間原始碼集的階層，以便在部分但非全部[支援的目標](multiplatform-dsl-reference.md#targets)之間共享通用程式碼。使用中間原始碼集有助於您：

*   為某些目標提供特定的 API。例如，函式庫可以在 Kotlin/Native 目標的中間原始碼集中新增原生特定 API，但不在 Kotlin/JVM 目標中新增。
*   為某些目標消耗特定的 API。例如，您可以從 Kotlin 多平台函式庫為構成中間原始碼集的某些目標提供的豐富 API 中獲益。
*   在專案中使用平台相關函式庫。例如，您可以從中間的 iOS 原始碼集中存取 iOS 專屬的依賴項。

Kotlin 工具鏈確保每個原始碼集只能存取適用於該原始碼集編譯的所有目標的 API。這可以防止諸如使用 Windows 專屬 API 然後將其編譯到 macOS，導致連結錯誤或執行時期未定義行為的情況發生。

設定原始碼集階層的推薦方法是使用[預設階層樣板](#default-hierarchy-template)。該樣板涵蓋了最常見的情況。如果您有更進階的專案，可以[手動配置](#manual-configuration)。這是一種更低階的方法：它更靈活，但需要更多的努力和知識。

## 預設階層樣板

Kotlin Gradle 外掛程式具有內建的預設[階層樣板](#see-the-full-hierarchy-template)。它包含一些常見用例的預定義中間原始碼集。外掛程式會根據您專案中指定的目標自動設定這些原始碼集。

考慮以下專案模組中包含共享程式碼的 `build.gradle(.kts)` 檔案：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()
}
```

</tab>
</tabs>

當您在程式碼中宣告 `androidTarget`、`iosArm64` 和 `iosSimulatorArm64` 目標時，Kotlin Gradle 外掛程式會從樣板中找到合適的共享原始碼集並為您建立它們。最終的階層如下所示：

![An example of using the default hierarchy template](default-hierarchy-example.svg)

彩色原始碼集是實際建立並存在於專案中的，而預設樣板中的灰色原始碼集則被忽略。例如，Kotlin Gradle 外掛程式沒有建立 `watchos` 原始碼集，因為專案中沒有 watchOS 目標。

如果您新增一個 watchOS 目標，例如 `watchosArm64`，則會建立 `watchos` 原始碼集，並且來自 `apple`、`native` 和 `common` 原始碼集的程式碼也將編譯到 `watchosArm64`。

Kotlin Gradle 外掛程式為預設階層樣板中的所有原始碼集提供了類型安全和靜態存取器，因此您可以直接引用它們，而無需像[手動配置](#manual-configuration)那樣使用 `by getting` 或 `by creating` 建構。

如果您在未先宣告對應目標的情況下嘗試存取共享模組的 `build.gradle(.kts)` 檔案中的原始碼集，您將看到一個警告：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
        // Warning: accessing source set without declaring the target
        linuxX64Main { }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
        // Warning: accessing source set without declaring the target
        linuxX64Main { }
    }
}
```

</tab>
</tabs>

> In this example, the `apple` and `native` source sets compile only to the `iosArm64` and `iosSimulatorArm64` targets.
> Despite their names, they have access to the full iOS API.
> This can be counter-intuitive for source sets like `native`, as you might expect that only APIs available on all
> native targets are accessible in this source set. This behavior may change in the future.
>
{style="note"}

### 其他配置

您可能需要調整預設階層樣板。如果您之前已經透過 `dependsOn` 呼叫[手動](#manual-configuration)引入了中間原始碼，它會取消預設階層樣板的使用並導致以下警告：

```none
The Default Kotlin Hierarchy Template was not applied to '<project-name>':
Explicit .dependsOn() edges were configured for the following source sets:
[<... names of the source sets with manually configured dependsOn-edges...>]

Consider removing dependsOn-calls or disabling the default template by adding
    'kotlin.mpp.applyDefaultHierarchyTemplate=false'
to your gradle.properties

Learn more about hierarchy templates: https://kotl.in/hierarchy-template
```

為了解決這個問題，請透過執行以下其中一項來配置您的專案：

*   [將您的手動配置取代為預設階層樣板](#replacing-a-manual-configuration)
*   [在預設階層樣板中建立額外的原始碼集](#creating-additional-source-sets)
*   [修改預設階層樣板建立的原始碼集](#modifying-source-sets)

#### 取代手動配置

**情境**。您所有的中間原始碼集目前都包含在預設階層樣板中。

**解決方案**。在共享模組的 `build.gradle(.kts)` 檔案中，移除所有手動的 `dependsOn()` 呼叫以及帶有 `by creating` 建構的原始碼集。要檢查所有預設原始碼集的列表，請參閱[完整階層樣板](#see-the-full-hierarchy-template)。

#### 建立額外的原始碼集

**情境**。您想要新增預設階層樣板尚未提供的原始碼集，例如一個介於 macOS 和 JVM 目標之間的。

**解決方案**：

1.  在共享模組的 `build.gradle(.kts)` 檔案中，透過明確呼叫 `applyDefaultHierarchyTemplate()` 重新套用樣板。
2.  使用 `dependsOn()` [手動](#manual-configuration)配置額外的原始碼集：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // Apply the default hierarchy again. It'll create, for example, the iosMain source set:
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // Create an additional jvmAndMacos source set:
            val jvmAndMacos by creating {
                dependsOn(commonMain.get())
            }
    
            macosArm64Main.get().dependsOn(jvmAndMacos)
            jvmMain.get().dependsOn(jvmAndMacos)
        }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // Apply the default hierarchy again. It'll create, for example, the iosMain source set:
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // Create an additional jvmAndMacos source set:
            jvmAndMacos {
                dependsOn(commonMain.get())
            }
            macosArm64Main {
                dependsOn(jvmAndMacos.get())
            }
            jvmMain {
                dependsOn(jvmAndMacos.get())
            }
        } 
    }
    ```

    </tab>
    </tabs>

#### 修改原始碼集

**情境**。您已經擁有與樣板生成的原始碼集同名，但用於專案中不同目標集的原始碼集。例如，`nativeMain` 原始碼集僅在桌面專用目標（`linuxX64`、`mingwX64` 和 `macosX64`）之間共享。

**解決方案**。目前無法修改樣板原始碼集之間的預設 `dependsOn` 關聯。同樣重要的是，例如 `nativeMain` 這些原始碼集的實作和意義在所有專案中都相同。

但是，您仍然可以執行以下其中一項：

*   在預設階層樣板或手動建立的原始碼集中找到適合您目的的不同原始碼集。
*   透過在 `gradle.properties` 檔案中新增 `kotlin.mpp.applyDefaultHierarchyTemplate=false` 來完全退出樣板，並手動配置所有原始碼集。

> 我們目前正在開發一個 API，用於建立您自己的階層樣板。這對於其階層配置與預設樣板顯著不同的專案會很有用。
>
> 該 API 尚未準備就緒，但如果您渴望嘗試，請查看 `applyHierarchyTemplate {}` 區塊和 `KotlinHierarchyTemplate.default` 的宣告作為範例。請記住，此 API 仍在開發中。它可能尚未經過測試，並可能在未來的版本中更改。
>
{style="tip"}

#### 查看完整階層樣板 {initial-collapse-state="collapsed" collapsible="true"}

當您宣告專案編譯的目標時，外掛程式會根據樣板中指定的目標選擇共享原始碼集，並在您的專案中建立它們。

![Default hierarchy template](full-template-hierarchy.svg)

> 此範例僅顯示專案的生產部分，省略了 `Main` 尾碼（例如，使用 `common` 而不是 `commonMain`）。然而，對於 `*Test` 原始碼，一切都是相同的。
>
{style="tip"}

## 手動配置

您可以在原始碼集結構中手動引入一個中間原始碼集。它將為多個目標保留共享程式碼。

例如，如果您想在原生 Linux、Windows 和 macOS 目標（`linuxX64`、`mingwX64` 和 `macosX64`）之間共享程式碼，該怎麼辦：

1.  在共享模組的 `build.gradle(.kts)` 檔案中，新增中間原始碼集 `desktopMain`，它將包含這些目標的共享邏輯。
2.  使用 `dependsOn` 關係設定原始碼集階層。將 `commonMain` 與 `desktopMain` 連接，然後將 `desktopMain` 與每個目標原始碼集連接：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">
    
    ```kotlin
    kotlin {
        linuxX64()
        mingwX64()
        macosX64()
    
        sourceSets {
            val desktopMain by creating {
                dependsOn(commonMain.get())
            }
    
            linuxX64Main.get().dependsOn(desktopMain)
            mingwX64Main.get().dependsOn(desktopMain)
            macosX64Main.get().dependsOn(desktopMain)
        }
    }
    ```
    
    </tab>
    <tab title="Groovy" group-key="groovy">
    
    ```groovy
    kotlin {
        linuxX64()
        mingwX64()
        macosX64()
    
        sourceSets {
            desktopMain {
                dependsOn(commonMain.get())
            }
            linuxX64Main {
                dependsOn(desktopMain)
            }
            mingwX64Main {
                dependsOn(desktopMain)
            }
            macosX64Main {
                dependsOn(desktopMain)
            }
        }
    }
    ```
    
    </tab>
    </tabs>

最終的階層式結構將如下所示：

![Manually configured hierarchical structure](manual-hierarchical-structure.svg)

您可以為以下目標組合擁有一個共享原始碼集：

*   JVM 或 Android + JS + Native
*   JVM 或 Android + Native
*   JS + Native
*   JVM 或 Android + JS
*   Native

Kotlin 目前不支援為以下組合共享原始碼集：

*   多個 JVM 目標
*   JVM + Android 目標
*   多個 JS 目標

如果您需要從共享原生原始碼集存取平台特定 API，IntelliJ IDEA 將幫助您偵測可以在共享原生程式碼中使用的通用宣告。對於其他情況，請使用 Kotlin 的[預期和實際宣告](multiplatform-expect-actual.md)機制。