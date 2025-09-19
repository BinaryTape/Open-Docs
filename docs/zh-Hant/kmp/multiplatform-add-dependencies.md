[//]: # (title: 新增多平台函式庫的依賴項)

每個程式都需要一套函式庫才能成功運作。Kotlin 多平台專案可以依賴適用於所有目標平台的多平台函式庫、平台專用函式庫，以及其他多平台專案。

要新增函式庫的依賴項，請更新您專案中包含共用程式碼目錄下的 `build.gradle(.kts)` 檔案。在 [`dependencies {}`](multiplatform-dsl-reference.md#dependencies) 區塊中，設定所需[類型](https://kotlinlang.org/docs/gradle-configure-project.html#dependency-types)的依賴項（例如，`implementation`）：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            implementation("com.example:my-library:1.0") // 所有原始碼集共用的函式庫
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                implementation 'com.example:my-library:1.0'
            }
        }
    }
}
```

</TabItem>
</Tabs>

## 對 Kotlin 函式庫的依賴

### 標準函式庫

每個原始碼集中都會自動新增對標準函式庫 (`stdlib`) 的依賴項。標準函式庫的版本與 `kotlin-multiplatform` 外掛程式的版本相同。

對於平台專用原始碼集，會使用函式庫相對應的平台專用變體，而通用標準函式庫則會新增到其餘原始碼集。Kotlin Gradle 外掛程式會根據 Gradle 建構指令碼的 `compilerOptions.jvmTarget` [編譯器選項](https://kotlinlang.org/docs/gradle-compiler-options.html)來選擇適當的 JVM 標準函式庫。

了解如何[變更預設行為](https://kotlinlang.org/docs/gradle-configure-project.html#dependency-on-the-standard-library)。

### 測試函式庫

對於多平台測試，可以使用 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API。當您建立多平台專案時，可以在 `commonTest` 中使用單一依賴項，將測試依賴項新增到所有原始碼集：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonTest.dependencies {
            implementation(kotlin("test")) // 自動引入所有平台依賴項
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // 自動引入所有平台依賴項
            }
        }
    }
}
```

</TabItem>
</Tabs>

### kotlinx 函式庫

如果您使用多平台函式庫並需要[依賴共用程式碼](#library-shared-for-all-source-sets)，只需在共用原始碼集中設定一次依賴項。使用函式庫的基本構件名稱，例如 `kotlinx-coroutines-core`：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
```

</TabItem>
</Tabs>

如果您需要 kotlinx 函式庫用於[平台專用依賴項](#library-used-in-specific-source-sets)，您仍然可以在相應的平台原始碼集中使用函式庫的基本構件名稱：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        jvmMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        jvmMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
```

</TabItem>
</Tabs>

## 對 Kotlin 多平台函式庫的依賴

您可以新增對已採用 Kotlin 多平台技術的函式庫的依賴項，例如 [SQLDelight](https://github.com/cashapp/sqldelight)。這些函式庫的作者通常會提供指南，說明如何將其依賴項新增到您的專案中。

> 在 [JetBrains 的搜尋平台](https://klibs.io/)上尋找 Kotlin 多平台函式庫。
>
{style="tip"}

### 所有原始碼集共用的函式庫

如果您想在所有原始碼集中使用某個函式庫，則只需將其新增到共用原始碼集。Kotlin 多平台外掛程式會自動將相應部分新增到任何其他原始碼集。

> 您不能在共用原始碼集中設定平台專用函式庫的依賴項。
>
{style="warning"}

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            implementation("io.ktor:ktor-client-core:%ktorVersion%")
        }
        androidMain.dependencies {
            // ktor-client 平台部分依賴項將會自動新增
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                implementation 'io.ktor:ktor-client-core:%ktorVersion%'
            }
        }
        androidMain {
            dependencies {
                // ktor-client 平台部分依賴項將會自動新增
            }
        }
    }
}
```

</TabItem>
</Tabs>

> 您也可以在頂層的 `dependencies {}` 區塊中配置共用函式庫。請參閱 [在頂層配置依賴項](multiplatform-dsl-reference.md#configure-dependencies-at-the-top-level)。
> 
{style="tip"}

### 在特定原始碼集中使用的函式庫

如果您只想針對特定原始碼集使用多平台函式庫，則可以專門將其新增到這些原始碼集。指定的函式庫宣告將僅在這些原始碼集中可用。

> 在這種情況下，請使用通用的函式庫名稱，而不是平台專用的名稱。如同下方 SQLDelight 範例所示，請使用 `native-driver`，而不是 `native-driver-iosx64`。請在函式庫的文件中找到確切名稱。
>
{style="note"}

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            // kotlinx.coroutines 將在所有原始碼集中可用
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
        androidMain.dependencies {

        }
        iosMain.dependencies {
            // SQLDelight 將僅在 iOS 原始碼集中可用，但在 Android 或 common 中不可用
            implementation("com.squareup.sqldelight:native-driver:%sqlDelightVersion%")
        }
        wasmJsMain.dependencies {
            
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                // kotlinx.coroutines 將在所有原始碼集中可用
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
        androidMain {
            dependencies {}
        }
        iosMain {
            dependencies {
                // SQLDelight 將僅在 iOS 原始碼集中可用，但在 Android 或 common 中不可用
                implementation 'com.squareup.sqldelight:native-driver:%sqlDelightVersion%'
            }
        }
        wasmJsMain {
            dependencies {}
        }
    }
}
```

</TabItem>
</Tabs>

## 對另一個多平台專案的依賴

您可以將一個多平台專案作為依賴項連接到另一個專案。要做到這一點，只需將專案依賴項新增到需要的原始碼集。如果您想在所有原始碼集中使用依賴項，請將其新增到共用原始碼集。在這種情況下，其他原始碼集將自動獲取其版本。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            implementation(project(":some-other-multiplatform-module"))
        }
        androidMain.dependencies {
            // :some-other-multiplatform-module 的平台部分將自動新增
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                implementation project(':some-other-multiplatform-module')
            }
        }
        androidMain {
            dependencies {
                // :some-other-multiplatform-module 的平台部分將自動新增
            }
        }
    }
}
```

</TabItem>
</Tabs>

## 接下來是什麼？

查看有關在多平台專案中新增依賴項的其他資源，並了解更多關於：

* [新增 Android 依賴項](multiplatform-android-dependencies.md)
* [新增 iOS 依賴項](multiplatform-ios-dependencies.md)
* [在以 iOS、Android、桌面和 Web 為目標的 Compose 多平台專案中新增依賴項](compose-multiplatform-modify-project.md#add-a-new-dependency)