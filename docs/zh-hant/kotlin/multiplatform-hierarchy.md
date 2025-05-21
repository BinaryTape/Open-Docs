---
title: "階層式專案結構 (Hierarchical project structure)"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin Multiplatform 專案支援階層式的原始碼集合（source set）結構。
這表示你可以安排一個中間原始碼集合的階層結構，以便在某些（但非全部）[支援目標](multiplatform-dsl-reference#targets)之間共享通用程式碼。 使用中間原始碼集合有助於：

* 為某些目標提供特定的 API（應用程式介面）。 例如，一個函式庫可以在中間原始碼集合中為 Kotlin/Native 目標添加原生特定的 API，但不能為 Kotlin/JVM 目標添加。
* 為某些目標使用特定的 API。 例如，你可以受益於 Kotlin Multiplatform 函式庫為某些形成中間原始碼集合的目標提供的豐富 API。
* 在你的專案中使用平台相關的函式庫。 例如，你可以從中間 iOS 原始碼集合存取 iOS 特定的依賴項。

Kotlin 工具鏈確保每個原始碼集合只能存取可用於該原始碼集合所編譯的所有目標的 API。 這樣可以避免使用 Windows 特定的 API，然後將其編譯到 macOS，從而導致連結錯誤或執行時未定義的行為。

建議設定原始碼集合階層結構的方式是使用[預設階層範本](#default-hierarchy-template)。 該範本涵蓋了最常見的用例。 如果你有更進階的專案，你可以[手動配置](#manual-configuration)。 這是一種更低階的方法：它更靈活，但需要更多的努力和知識。

## 預設階層範本 (Default hierarchy template)

Kotlin Gradle 外掛程式有一個內建的預設[階層範本](#see-the-full-hierarchy-template)。 它包含一些常見用例的預定義中間原始碼集合。 外掛程式會根據你在專案中指定的目標自動設定這些原始碼集合。

請考慮包含共享程式碼的專案模組中的以下 `build.gradle(.kts)` 檔案：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()
}
```

</TabItem>
</Tabs>

當你在程式碼中宣告目標 `androidTarget`、`iosArm64` 和 `iosSimulatorArm64` 時，Kotlin Gradle 外掛程式會從範本中找到合適的共享原始碼集合，並為你建立它們。 結果的階層結構如下所示：

<img src="/img/default-hierarchy-example.svg" alt="使用預設階層範本的範例" style={{verticalAlign: 'middle'}}/>

彩色的原始碼集合實際上是在專案中建立和存在的，而預設範本中的灰色原始碼集合則被忽略。 例如，Kotlin Gradle 外掛程式沒有建立 `watchos` 原始碼集合，因為專案中沒有 watchOS 目標。

如果你新增一個 watchOS 目標，例如 `watchosArm64`，則會建立 `watchos` 原始碼集合，並且來自 `apple`、`native` 和 `common` 原始碼集合的程式碼也會被編譯為 `watchosArm64`。

Kotlin Gradle 外掛程式為預設階層範本中的所有原始碼集合提供型別安全且靜態的存取器，因此你可以引用它們，而無需像[手動配置](#manual-configuration)那樣使用 `by getting` 或 `by creating` 結構。

如果你嘗試在共享模組的 `build.gradle(.kts)` 檔案中存取原始碼集合，但沒有先宣告相應的目標，你將會看到一個警告：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
        }
        // Warning: accessing source set without declaring the target
        linuxX64Main { }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1'
            }
        }
        // Warning: accessing source set without declaring the target
        linuxX64Main { }
    }
}
```

</TabItem>
</Tabs>

:::note
在這個範例中，`apple` 和 `native` 原始碼集合僅編譯為 `iosArm64` 和 `iosSimulatorArm64` 目標。 儘管它們的名稱如此，但它們可以存取完整的 iOS API。
對於像 `native` 這樣的原始碼集合來說，這可能違反直覺，因為你可能會期望只有在所有原生目標上都可用的 API 才能在這個原始碼集合中存取。 這種行為將來可能會改變。

:::

### 其他配置 (Additional configuration)

你可能需要對預設階層範本進行調整。 如果你之前已經[手動](#manual-configuration)使用 `dependsOn` 呼叫引入了中間原始碼，它會取消使用預設階層範本，並導致以下警告：

```none
The Default Kotlin Hierarchy Template was not applied to '<project-name>':
Explicit .dependsOn() edges were configured for the following source sets:
[<... names of the source sets with manually configured dependsOn-edges...>]

Consider removing dependsOn-calls or disabling the default template by adding
    'kotlin.mpp.applyDefaultHierarchyTemplate=false'
to your gradle.properties

Learn more about hierarchy templates: https://kotl.in/hierarchy-template
```

要解決這個問題，請透過執行以下操作之一來配置你的專案：

* [使用預設階層範本替換你的手動配置](#replacing-a-manual-configuration)
* [在預設階層範本中建立額外的原始碼集合](#creating-additional-source-sets)
* [修改預設階層範本建立的原始碼集合](#modifying-source-sets)

#### 替換手動配置 (Replacing a manual configuration)

**情況**。 你的所有中間原始碼集合目前都包含在預設階層範本中。

**解決方案**。 在共享模組的 `build.gradle(.kts)` 檔案中，移除所有手動 `dependsOn()` 呼叫和使用 `by creating` 結構的原始碼集合。 要檢查所有預設原始碼集合的列表，請參閱[完整的階層範本](#see-the-full-hierarchy-template)。

#### 建立額外的原始碼集合 (Creating additional source sets)

**情況**。 你想要新增預設階層範本尚未提供的原始碼集合，例如，一個在 macOS 和 JVM 目標之間的原始碼集合。

**解決方案**：

1. 在共享模組的 `build.gradle(.kts)` 檔案中，透過顯式呼叫 `applyDefaultHierarchyTemplate()` 重新應用範本。
2. 使用 `dependsOn()` [手動](#manual-configuration)配置其他原始碼集合：

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

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

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

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

    </TabItem>
    </Tabs>

#### 修改原始碼集合 (Modifying source sets)

**情況**。 你已經有與範本產生的原始碼集合具有完全相同名稱的原始碼集合，但在專案中的不同目標集之間共享。 例如，`nativeMain` 原始碼集合僅在桌面特定的目標之間共享：`linuxX64`、`mingwX64` 和 `macosX64`。

**解決方案**。 目前無法修改範本原始碼集合之間的預設 `dependsOn` 關係。
同樣重要的是，原始碼集合（例如 `nativeMain`）的實現和含義在所有專案中都是相同的。

但是，你仍然可以執行以下操作之一：

* 在預設階層範本中或手動建立的原始碼集合中，找到適合你用途的不同原始碼集合。
* 透過將 `kotlin.mpp.applyDefaultHierarchyTemplate=false` 新增到你的 `gradle.properties` 檔案並手動配置所有原始碼集合，完全退出範本。

:::tip
我們目前正在開發一個 API 來建立你自己的階層範本。 這對於階層配置與預設範本顯著不同的專案非常有用。

這個 API 尚未準備好，但如果你渴望嘗試它，請查看 `applyHierarchyTemplate {}` 區塊和 `KotlinHierarchyTemplate.default` 的宣告作為範例。 請記住，這個 API 仍在開發中。 它可能未經過測試，並且可能會在未來的版本中發生變化。

:::

#### 查看完整的階層範本 (See the full hierarchy template)

當你宣告專案編譯的目標時，外掛程式會根據你在範本中指定的目標選擇共享原始碼集合，並在你的專案中建立它們。

<img src="/img/full-template-hierarchy.svg" alt="預設階層範本" style={{verticalAlign: 'middle'}}/>
:::tip
此範例僅顯示專案的生產部分，省略了 `Main` 後綴
（例如，使用 `common` 而不是 `commonMain`）。 但是，對於 `*Test` 原始碼也是如此。

:::

## 手動配置 (Manual configuration)

你可以在原始碼集合結構中手動引入中間原始碼。
它將保存多個目標的共享程式碼。

例如，如果你想要在原生 Linux、Windows 和 macOS 目標（`linuxX64`、`mingwX64` 和 `macosX64`）之間共享程式碼，請執行以下操作：

1. 在共享模組的 `build.gradle(.kts)` 檔案中，新增中間原始碼集合 `desktopMain`，它保存這些目標的共享邏輯。
2. 使用 `dependsOn` 關係，設定原始碼集合階層結構。 將 `commonMain` 與 `desktopMain` 連接，然後將 `desktopMain` 與每個目標原始碼集合連接：

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>
    
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
    
    </TabItem>
    <TabItem value="groovy" label="Groovy" default>
    
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
    
    </TabItem>
    </Tabs>

結果的階層結構如下所示：

<img src="/img/manual-hierarchical-structure.svg" alt="手動配置的階層結構" style={{verticalAlign: 'middle'}}/>

你可以為以下目標組合建立共享原始碼集合：

* JVM 或 Android + JS + Native
* JVM 或 Android + Native
* JS + Native
* JVM 或 Android + JS
* Native

Kotlin 目前不支援為以下組合共享原始碼集合：

* 多個 JVM 目標
* JVM + Android 目標
* 多個 JS 目標

如果你需要從共享原生原始碼集合存取平台特定的 API，IntelliJ IDEA 將幫助你偵測可以在共享原生程式碼中使用的通用宣告。
對於其他情況，請使用 Kotlin 的 [expected 和 actual 宣告](multiplatform-expect-actual)機制。