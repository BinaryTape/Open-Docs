[//]: # (title: 層級式專案結構)

Kotlin Multiplatform 專案支援層級式原始碼集結構。
這表示您可以安排中介原始碼集的層級結構，以便在部分（而非所有）
[支援的目標平台](multiplatform-dsl-reference.md#targets)之間共用通用程式碼。使用中介原始碼集有助於您：

*   為某些目標平台提供特定的 API。例如，函式庫可以在中介原始碼集中為 Kotlin/Native 目標平台添加原生特定 API，但不是為 Kotlin/JVM 目標平台。
*   為某些目標平台使用特定的 API。例如，您可以從 Kotlin Multiplatform 函式庫為形成中介原始碼集的一些目標平台提供的豐富 API 中獲益。
*   在專案中使用依賴於平台的函式庫。例如，您可以從中介的 iOS 原始碼集存取 iOS 特定的依賴項。

Kotlin 工具鏈確保每個原始碼集只能存取適用於該原始碼集編譯的所有目標平台的 API。這可以防止諸如使用 Windows 特定 API 然後將其編譯到 macOS 的情況，導致連結錯誤或執行時的未定義行為。

設定原始碼集層級的建議方式是使用[預設層級範本](#default-hierarchy-template)。
該範本涵蓋了最常見的用例。如果您有更進階的專案，可以[手動配置](#manual-configuration)它。
這是一種更底層的方法：它更靈活，但需要更多的努力和知識。

## 預設層級範本

Kotlin Gradle 外掛程式具有內建的預設[層級範本](#see-the-full-hierarchy-template)。
它包含了一些常見用例的預定義中介原始碼集。
該外掛程式會根據您專案中指定的目標平台自動設定這些原始碼集。

考慮專案模組中包含共用程式碼的 `build.gradle(.kts)` 檔案：

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

當您在程式碼中宣告目標平台 `android`、`iosArm64` 和 `iosSimulatorArm64` 時，Kotlin Gradle 外掛程式會從範本中找到合適的共用原始碼集並為您建立它們。產生的層級結構如下所示：

![An example of using the default hierarchy template](default-hierarchy-example.svg)

有顏色的原始碼集是實際建立並存在於專案中的，而預設範本中灰色的則被忽略。例如，Kotlin Gradle 外掛程式沒有建立 `watchos` 原始碼集，因為專案中沒有 watchOS 目標平台。

如果您新增一個 watchOS 目標平台，例如 `watchosArm64`，則會建立 `watchos` 原始碼集，並且來自 `apple`、`native` 和 `common` 原始碼集的程式碼也將編譯到 `watchosArm64`。

Kotlin Gradle 外掛程式為預設層級範本中的所有原始碼集提供了型別安全和靜態存取器，因此與[手動配置](#manual-configuration)相比，您無需使用 `by getting` 或 `by creating` 建構即可引用它們。

如果您嘗試在共用模組的 `build.gradle(.kts)` 檔案中存取原始碼集而未先宣告對應的目標平台，您將看到一個警告：

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
        // Warning: accessing source set without declaring the target
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
        // Warning: accessing source set without declaring the target
        linuxX64Main { }
    }
}
```

</TabItem>
</Tabs>

> 在此範例中，`apple` 和 `native` 原始碼集僅編譯到 `iosArm64` 和 `iosSimulatorArm64` 目標平台。
> 儘管名稱如此，它們仍可存取完整的 iOS API。
> 這對於諸如 `native` 之類的原始碼集可能有些反直覺，因為您可能預期此原始碼集中只能存取所有原生目標平台可用的 API。此行為未來可能會改變。
>
{style="note"}

### 額外配置

您可能需要對預設層級範本進行調整。如果您之前曾使用 `dependsOn` 呼叫[手動](#manual-configuration)引入中介原始碼集，這會取消預設層級範本的使用並導致此警告：

```none
預設 Kotlin 層級範本未套用到 '<project-name>'：
已為以下原始碼集配置了明確的 .dependsOn() 邊緣：
[<... names of the source sets with manually configured dependsOn-edges...>]

考慮移除 dependsOn 呼叫，或透過新增
    'kotlin.mpp.applyDefaultHierarchyTemplate=false'
至您的 gradle.properties 檔案來停用預設範本

學習更多有關層級範本的資訊：https://kotl.in/hierarchy-template
```

為了解決此問題，請透過以下方式之一配置您的專案：

*   [將您的手動配置替換為預設層級範本](#replacing-a-manual-configuration)
*   [在預設層級範本中建立額外的原始碼集](#creating-additional-source-sets)
*   [修改由預設層級範本建立的原始碼集](#modifying-source-sets)

#### 替換手動配置

**情境**。您所有的中介原始碼集目前都涵蓋在預設層級範本中。

**解決方案**。在共用模組的 `build.gradle(.kts)` 檔案中，移除所有手動 `dependsOn()` 呼叫以及帶有 `by creating` 建構的原始碼集。若要查看所有預設原始碼集的清單，請參閱[完整層級範本](#see-the-full-hierarchy-template)。

#### 建立額外的原始碼集

**情境**。您想新增預設層級範本尚未提供的原始碼集，例如在 macOS 和 JVM 目標平台之間新增一個。

**解決方案**：

1.  在共用模組的 `build.gradle(.kts)` 檔案中，透過明確呼叫 `applyDefaultHierarchyTemplate()` 來重新套用範本。
2.  使用 `dependsOn()` [手動配置](#manual-configuration)額外的原始碼集：

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">

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
    <TabItem title="Groovy" group-key="groovy">

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

#### 修改原始碼集

**情境**。您已經擁有與範本產生之原始碼集名稱完全相同，但在專案中於不同目標平台集之間共用的原始碼集。例如，一個 `nativeMain` 原始碼集僅在桌面特定目標平台之間共用：`linuxX64`、`mingwX64` 和 `macosX64`。

**解決方案**。目前無法修改範本原始碼集之間的預設 `dependsOn` 關聯。同樣重要的是，原始碼集（例如 `nativeMain`）的實作和意義在所有專案中都應相同。

但是，您仍然可以執行以下其中一項：

*   在預設層級範本中或手動建立的原始碼集中，找到適合您目的的不同原始碼集。
*   透過在 `gradle.properties` 檔案中新增 `kotlin.mpp.applyDefaultHierarchyTemplate=false` 來完全退出該範本，並手動配置所有原始碼集。

> 我們目前正在開發一個 API，用於建立您自己的層級範本。這對於其層級配置與預設範本顯著不同的專案會很有用。
>
> 此 API 尚未就緒，但如果您渴望嘗試它，請查看 `applyHierarchyTemplate {}` 區塊和 `KotlinHierarchyTemplate.default` 的宣告作為範例。請記住，此 API 仍在開發中。它可能未經測試，並可能在未來的版本中改變。
>
{style="tip"}

#### 查看完整層級範本 {initial-collapse-state="collapsed" collapsible="true"}

當您宣告專案編譯的目標平台時，外掛程式會根據範本中指定的目標平台挑選共用原始碼集，並在您的專案中建立它們。

![Default hierarchy template](full-template-hierarchy.svg)

> 此範例僅顯示專案的產品部分，省略了 `Main` 後綴（例如，使用 `common` 而非 `commonMain`）。然而，對於 `*Test` 原始碼也是如此。
>
{style="tip"}

## 手動配置

您可以在原始碼集結構中手動引入中介原始碼集。它將存放多個目標平台的共用程式碼。

例如，如果您想在原生 Linux、Windows 和 macOS 目標平台（`linuxX64`、`mingwX64` 和 `macosX64`）之間共用程式碼，請執行以下操作：

1.  在共用模組的 `build.gradle(.kts)` 檔案中，新增中介原始碼集 `myDesktopMain`，它將存放這些目標平台的共用邏輯。
2.  使用 `dependsOn` 關聯，設定原始碼集層級。將 `commonMain` 與 `myDesktopMain` 連接，然後將 `myDesktopMain` 與每個目標原始碼集連接：

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        linuxX64()
        mingwX64()
        macosX64()
    
        sourceSets {
            val myDesktopMain by creating {
                dependsOn(commonMain.get())
            }
    
            linuxX64Main.get().dependsOn(myDesktopMain)
            mingwX64Main.get().dependsOn(myDesktopMain)
            macosX64Main.get().dependsOn(myDesktopMain)
        }
    }
    ```

    </TabItem>
    <TabItem title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        linuxX64()
        mingwX64()
        macosX64()
    
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
            macosX64Main {
                dependsOn(myDesktopMain)
            }
        }
    }
    ```

    </TabItem>
    </Tabs>

產生的層級結構將如下所示：

![Manually configured hierarchical structure](manual-hierarchical-structure.svg)

您可以為以下目標平台組合擁有一個共用原始碼集：

*   JVM or Android + Web + Native
*   JVM or Android + Native
*   Web + Native
*   JVM or Android + Web
*   Native

Kotlin 目前不支援為這些組合共用原始碼集：

*   多個 JVM 目標平台
*   JVM + Android 目標平台
*   多個 JS 目標平台

如果您需要從共用的原生原始碼集存取特定平台 API，IntelliJ IDEA 將幫助您偵測可以在共用原生程式碼中使用的通用宣告。對於其他情況，請使用 Kotlin 的[預期與實際宣告](multiplatform-expect-actual.md)機制。