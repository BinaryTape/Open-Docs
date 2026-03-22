[//]: # (title: 階層式專案結構)

Kotlin Multiplatform 專案支援階層式的原始碼集結構。
這意味著您可以安排中間原始碼集的階層結構，以便在部分（而非全部）[支援的目標](multiplatform-dsl-reference.md#targets)之間共享通用程式碼。使用中間原始碼集有助於：

* **為某些目標提供特定 API**。例如，程式庫可以在針對 Kotlin/Native 目標的中間原始碼集中加入原生專用的 API，但不適用於 Kotlin/JVM 目標。
* **在某些目標中使用特定 API**。例如，您可以受益於 Kotlin Multiplatform 程式庫為構成中間原始碼集的某些目標所提供的豐富 API。
* **在您的專案中使用平台相依的程式庫**。例如，您可以從中間 iOS 原始碼集存取 iOS 專用的相依性。

Kotlin 工具鏈確保每個原始碼集僅能存取該原始碼集編譯至的所有目標中皆可使用的 API。這可防止諸如使用 Windows 專用 API 後又編譯到 macOS 的情況，從而避免在執行階段產生連結錯誤或未定義行為。

建議設定原始碼集階層的方法是使用 [預設階層範本](#default-hierarchy-template)。
該範本涵蓋了最常見的情況。如果您有更進階的專案，可以 [手動配置](#manual-configuration)。
這是一種更低階的方法：它更靈活，但需要更多的精力與知識。

## 預設階層範本

Kotlin Gradle 外掛程式內建了預設的 [階層範本](#see-the-full-hierarchy-template)。
它包含為一些常見使用案例預先定義的中間原始碼集。
該外掛程式會根據您專案中指定的目標自動設定這些原始碼集。

請考慮專案模組中包含共享程式碼的以下 `build.gradle(.kts)` 檔案：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    android()
    iosArm64()
    iosSimulatorArm64()
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    android()
    iosArm64()
    iosSimulatorArm64()
}
```

</TabItem>
</Tabs>

當您在程式碼中宣告 `android`、`iosArm64` 與 `iosSimulatorArm64` 目標時，Kotlin Gradle 外掛程式會從範本中尋找適合的共享原始碼集並為您建立。產生的階層如下所示：

![使用預設階層範本的範例](default-hierarchy-example.svg)

有顏色的原始碼集是實際建立並存在於專案中的，而預設範本中灰色的原始碼集則被忽略。例如，Kotlin Gradle 外掛程式沒有建立 `watchos` 原始碼集，因為專案中沒有 watchOS 目標。

如果您新增一個 watchOS 目標（例如 `watchosArm64`），則會建立 `watchos` 原始碼集，且來自 `apple`、`native` 與 `common` 原始碼集的程式碼也會編譯到 `watchosArm64` 目標。

Kotlin Gradle 外掛程式為預設階層範本中的所有原始碼集提供了型別安全且靜態的存取器，因此與 [手動配置](#manual-configuration) 相比，您可以直接引用它們，而不需要使用 `by getting` 或 `by creating` 建構。

如果您嘗試在共享模組的 `build.gradle(.kts)` 檔案中存取原始碼集，而未先宣告對應的目標，您將會看到警告：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    android()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
        // 警告：在未宣告目標的情況下存取原始碼集
        linuxX64Main { }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    android()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
        // 警告：在未宣告目標的情況下存取原始碼集
        linuxX64Main { }
    }
}
```

</TabItem>
</Tabs>

> 在此範例中，`apple` 與 `native` 原始碼集僅編譯至 `iosArm64` 與 `iosSimulatorArm64` 目標。
> 儘管它們的名稱如此，但它們可以存取完整的 iOS API。
> 對於像 `native` 這樣的原始碼集，這可能與直覺相反，因為您可能預期在該原始碼集中只能存取所有原生目標上通用的 API。此行為在未來可能會改變。
>
{style="note"}

### 額外配置

您可能需要對預設階層範本進行調整。如果您先前透過 `dependsOn` 呼叫 [手動](#manual-configuration) 引入了中間原始碼，這會取消預設階層範本的使用並導致以下警告：

```none
The Default Kotlin Hierarchy Template was not applied to '<project-name>':
Explicit .dependsOn() edges were configured for the following source sets:
[<... names of the source sets with manually configured dependsOn-edges...>]

Consider removing dependsOn-calls or disabling the default template by adding
    'kotlin.mpp.applyDefaultHierarchyTemplate=false'
to your gradle.properties

Learn more about hierarchy templates: https://kotl.in/hierarchy-template
```

要解決此問題，請透過執行以下任一操作來配置您的專案：

* [將您的手動配置替換為預設階層範本](#replacing-a-manual-configuration)
* [在預設階層範本中建立額外的原始碼集](#creating-additional-source-sets)
* [修改預設階層範本建立的原始碼集](#modifying-source-sets)

#### 替換手動配置

**案例**：您所有的中間原始碼集目前都已包含在預設階層範本中。

**解決方案**：在共享模組的 `build.gradle(.kts)` 檔案中，移除所有手動的 `dependsOn()` 呼叫以及使用 `by creating` 構建的原始碼集。要查看所有預設原始碼集的列表，請參閱 [完整階層範本](#see-the-full-hierarchy-template)。

#### 建立額外原始碼集

**案例**：您想要新增預設階層範本尚未提供的原始碼集，例如在 macOS 與 JVM 目標之間的原始碼集。

**解決方案**：

1. 在共享模組的 `build.gradle(.kts)` 檔案中，透過顯式呼叫 `applyDefaultHierarchyTemplate()` 重新套用範本。
2. 使用 `dependsOn()` [手動](#manual-configuration) 配置額外的原始碼集：

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // 再次套用預設階層。它會建立（例如）iosMain 原始碼集：
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // 建立一個額外的 jvmAndMacos 原始碼集：
            val jvmAndMacos by creating {
                dependsOn(commonMain.get())
            }
    
            macosArm64Main.get().dependsOn(jvmAndMacos)
            jvmMain.get().dependsOn(jvmAndMacos)
        }
    }
    ```

    </TabItem>
    <TabItem title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // 再次套用預設階層。它會建立（例如）iosMain 原始碼集：
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // 建立一個額外的 jvmAndMacos 原始碼集：
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

#### 修改原始碼集

**案例**：您已經擁有與範本生成的名稱完全相同的原始碼集，但在專案中是在不同的目標集之間共享。例如，`nativeMain` 原始碼集僅在桌面專用的目標之間共享：`linuxX64`、`mingwX64` 與 `macosArm64`。

**解決方案**：目前無法修改範本原始碼集之間預設的 `dependsOn` 關係。同樣重要的是，原始碼集的實作與含義（例如 `nativeMain`）在所有專案中都應保持一致。

然而，您仍然可以執行以下任一操作：

* 在預設階層範本中尋找符合您需求的不同原始碼集，或是使用手動建立的原始碼集。
* 在您的 `gradle.properties` 檔案中加入 `kotlin.mpp.applyDefaultHierarchyTemplate=false` 以完全停用範本，並手動配置所有原始碼集。

> 我們目前正在開發用於建立您自定義階層範本的 API。這對於階層配置與預設範本有顯著差異的專案將會非常有用。
>
> 該 API 尚未準備就緒，但如果您渴望嘗試，可以參考 `applyHierarchyTemplate {}` 區塊以及 `KotlinHierarchyTemplate.default` 的宣告作為範例。請記住，此 API 仍在開發中。它可能尚未經過測試，並可能在之後的版本中發生變化。
>
{style="tip"}

#### 查看完整階層範本 {initial-collapse-state="collapsed" collapsible="true"}

當您宣告專案編譯至的目標時，外掛程式會根據範本中指定的目標選取共享原始碼集，並在您的專案中建立它們。

![預設階層範本](full-template-hierarchy.svg)

> 此範例僅顯示專案的正式產品（production）部分，省略了 `Main` 後綴（例如使用 `common` 而非 `commonMain`）。然而，對於 `*Test` 原始碼集，一切都是相同的。
>
{style="tip"}

## 手動配置

您可以在原始碼集結構中手動引入中間原始碼。它將保存多個目標的共享程式碼。

例如，如果您想在原生 Linux、Windows 與 macOS 目標（`linuxX64`、`mingwX64` 與 `macosArm64`）之間共享程式碼，請執行以下操作：

1. 在共享模組的 `build.gradle(.kts)` 檔案中，新增中間原始碼集 `myDesktopMain`，它將保存這些目標的共享邏輯。
2. 使用 `dependsOn` 關係設定原始碼集階層。將 `commonMain` 與 `myDesktopMain` 連接，然後將 `myDesktopMain` 與每個目標原始碼集連接：

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">
    
    ```kotlin
    kotlin {
        linuxX64()
        mingwX64()
        macosArm64()
    
        sourceSets {
            val myDesktopMain by creating {
                dependsOn(commonMain.get())
            }
    
            linuxX64Main.get().dependsOn(myDesktopMain)
            mingwX64Main.get().dependsOn(myDesktopMain)
            macosArm64Main.get().dependsOn(myDesktopMain)
        }
    }
    ```
    
    </TabItem>
    <TabItem title="Groovy" group-key="groovy">
    
    ```groovy
    kotlin {
        linuxX64()
        mingwX64()
        macosArm64()
    
        sourceSets {
            myDesktopMain {
                dependsOn(commonMain.get())
            }
            linuxX64Main {
                dependsOn(myDesktopMain)
            }
            mingwX64Main {
                dependsOn(myDesktopMain)
            }
            macosArm64Main {
                dependsOn(myDesktopMain)
            }
        }
    }
    ```
    
    </TabItem>
    </Tabs>

產生的階層結構如下所示：

![手動配置的階層結構](manual-hierarchical-structure.svg)

您可以針對以下目標組合擁有共享原始碼集：

* JVM 或 Android + Web + 原生
* JVM 或 Android + 原生
* Web + 原生
* JVM 或 Android + Web
* 原生

Kotlin 目前不支援在以下組合中共享原始碼集：

* 多個 JVM 目標
* JVM + Android 目標
* 多個 JS 目標

如果您需要從共享的原生原始碼集存取平台專用的 API，IntelliJ IDEA 會協助您偵測可在共享原生程式碼中使用的通用宣告。對於其他情況，請使用 Kotlin 的 [預期宣告與實際宣告](multiplatform-expect-actual.md) 機制。