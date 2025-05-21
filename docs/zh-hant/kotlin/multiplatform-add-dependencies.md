---
title: 新增對多平臺函式庫的依賴項目
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

每個程式都需要一組函式庫才能成功運作。一個 Kotlin Multiplatform 專案可以依賴於適用於所有目標平台的 multiplatform 函式庫、平台特定的函式庫以及其他 multiplatform 專案。

要新增對函式庫的依賴，請更新包含共享程式碼的專案目錄中的 `build.gradle(.kts)` 檔案。在 [`dependencies {}`](multiplatform-dsl-reference#dependencies) 區塊中，設定所需[類型](gradle-configure-project#dependency-types)的依賴（例如，`implementation`）：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("com.example:my-library:1.0") // library shared for all source sets
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
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

或者，您可以[在頂層設定依賴](gradle-configure-project#set-dependencies-at-top-level)。

## 依賴 Kotlin 函式庫

### 標準函式庫（Standard library）

每個 source set 中都會自動新增對標準函式庫（`stdlib`）的依賴。標準函式庫的版本與 `kotlin-multiplatform` 外掛程式的版本相同。

對於平台特定的 source set，將使用該函式庫對應的平台特定變體，而通用標準函式庫將新增到其餘部分。 Kotlin Gradle 外掛程式將根據 Gradle 建置腳本的 `compilerOptions.jvmTarget` [編譯器選項](gradle-compiler-options) 選擇適當的 JVM 標準函式庫。

瞭解如何[變更預設行為](gradle-configure-project#dependency-on-the-standard-library)。

### 測試函式庫（Test libraries）

對於 multiplatform 測試，可以使用 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API。 當您建立 multiplatform 專案時，可以使用 `commonTest` 中的單個依賴項將測試依賴項新增到所有 source set：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonTest.dependencies {
            implementation(kotlin("test")) // Brings all the platform dependencies automatically
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // Brings all the platform dependencies automatically
            }
        }
    }
}
```

</TabItem>
</Tabs>

### kotlinx 函式庫

如果您使用 multiplatform 函式庫並且需要[依賴於共享程式碼](#library-shared-for-all-source-sets)，則只需在共享 source set 中設定一次依賴。 使用函式庫基本 artifact 名稱，例如 `kotlinx-coroutines-core`：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1'
            }
        }
    }
}
```

</TabItem>
</Tabs>

如果您需要用於[平台特定依賴項](#library-used-in-specific-source-sets)的 kotlinx 函式庫，您仍然可以在相應的平台 source set 中使用函式庫的基本 artifact 名稱：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        jvmMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        jvmMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1'
            }
        }
    }
}
```

</TabItem>
</Tabs>

## 依賴 Kotlin Multiplatform 函式庫

您可以新增對採用 Kotlin Multiplatform 技術的函式庫的依賴，例如 [SQLDelight](https://github.com/cashapp/sqldelight)。 這些函式庫的作者通常會提供將其依賴項新增至專案的指南。

:::note
在 [JetBrains 的搜尋平台](https://klibs.io/) 上尋找 Kotlin Multiplatform 函式庫。

### 所有 source set 共享的函式庫

如果要從所有 source set 使用函式庫，則只能將其新增到 common source set。 Kotlin Multiplatform Mobile 外掛程式會自動將相應的部分新增到任何其他 source set。

您無法在 common source set 中設定對平台特定函式庫的依賴。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("io.ktor:ktor-client-core:3.1.1")
        }
        androidMain.dependencies {
            // dependency to a platform part of ktor-client will be added automatically
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'io.ktor:ktor-client-core:3.1.1'
            }
        }
        androidMain {
            dependencies {
                // dependency to platform part of ktor-client will be added automatically
            }
        }
    }
}
```

</TabItem>
</Tabs>

### 特定 source set 中使用的函式庫

如果只想將 multiplatform 函式庫用於特定的 source set，則可以將其專門新增到這些 source set。 然後，指定的函式庫宣告將僅在這些 source set 中可用。

在這種情況下，請使用通用的函式庫名稱，而不是平台特定的名稱。 與下面範例中的 SQLDelight 一樣，請使用 `native-driver`，而不是 `native-driver-iosx64`。 在函式庫的文件中找到確切的名稱。

:::

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            // kotlinx.coroutines will be available in all source sets
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
        }
        androidMain.dependencies {

        }
        iosMain.dependencies {
            // SQLDelight will be available only in the iOS source set, but not in Android or common
            implementation("com.squareup.sqldelight:native-driver:2.0.2")
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                // kotlinx.coroutines will be available in all source sets
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1'
            }
        }
        androidMain {
            dependencies {}
        }
        iosMain {
            dependencies {
                // SQLDelight will be available only in the iOS source set, but not in Android or common
                implementation 'com.squareup.sqldelight:native-driver:2.0.2'
            }
        }
    }
}
```

</TabItem>
</Tabs>

## 依賴另一個 multiplatform 專案

您可以將一個 multiplatform 專案作為依賴項連接到另一個專案。 為此，只需將專案依賴項新增到需要它的 source set。 如果想在所有 source set 中使用依賴項，請將其新增到 common source set。 在這種情況下，其他 source set 將自動取得其版本。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation(project(":some-other-multiplatform-module"))
        }
        androidMain.dependencies {
            // platform part of :some-other-multiplatform-module will be added automatically
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation project(':some-other-multiplatform-module')
            }
        }
        androidMain {
            dependencies {
                // platform part of :some-other-multiplatform-module will be added automatically
            }
        }
    }
}
```

</TabItem>
</Tabs>

## 接下來做什麼？

查看有關在 multiplatform 專案中新增依賴項的其他資源，並瞭解更多資訊：

* [新增 Android 依賴項](multiplatform-android-dependencies)
* [新增 iOS 依賴項](multiplatform-ios-dependencies)