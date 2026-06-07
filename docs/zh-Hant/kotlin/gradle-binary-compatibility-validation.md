[//]: # (title: Kotlin Gradle 外掛程式中的二進位相容性驗證)

<primary-label ref="experimental-general"/>

二進位相容性驗證可協助程式庫作者確保使用者在升級至新版本時不會破壞其程式碼。這不僅對於提供流暢的升級體驗至關重要，也是與使用者建立長期信任並鼓勵持續採用該程式庫的關鍵。

> 二進位相容性意味著程式庫兩個版本的編譯後位元組碼 (bytecode) 可以互換執行，而不需要重新編譯。
> 
{style="tip"}

Kotlin Gradle 外掛程式包含對二進位相容性驗證的支援。該外掛程式會從目前程式碼產生應用程式二進位介面 (ABI) 傾印 (dumps)，並將其與之前的傾印進行比較以醒目提示差異。您可以檢閱這些變更，找出任何潛在的二進位不相容修改，並採取行動予以解決。

## 如何啟用

若要啟用二進位相容性驗證，請在您的 `build.gradle.kts` 檔案中加入 `abiValidation {}` 區塊。如果您沒有自訂設定，則可以改用 `abiValidation()` 函式：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation()
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    abiValidation()
}
```

</tab>
</tabs>

KGP 會建立必要的 Gradle 任務。如果您的專案有多個需要檢查二進位相容性的模組，請分別設定每個模組。

## 檢查二進位相容性問題

在對程式碼進行變更後，若要檢查潛在的二進位不相容問題，請在 IntelliJ IDEA 中執行 `checkKotlinAbi` Gradle 任務，或在專案目錄中使用以下指令：

```bash
./gradlew checkKotlinAbi
```

該任務會比較 ABI 傾印並將偵測到的任何差異輸出為錯誤。請仔細檢查輸出，以判斷是否需要修改程式碼以維持二進位相容性。

預設情況下，[當您的專案啟用了二進位相容性驗證](#how-to-enable)且執行 `check` 任務時，Gradle 也會執行 `checkKotlinAbi` 任務。 

## 更新參考 ABI 傾印

若要更新 Gradle 用來檢查最新變更的參考 ABI 傾印，請在 IntelliJ IDEA 中執行 `updateKotlinAbi` 任務，或在專案目錄中使用以下指令：

```bash
./gradlew updateKotlinAbi
```

僅當您確定變更與前一版本保持二進位相容性時，才更新參考傾印。

## 設定篩選器

您可以定義篩選器來控制 ABI 傾印中包含哪些類別、屬性和函式。使用 `filters {}` 區塊，分別透過 `excluded {}` 和 `included {}` 區塊來加入排除和包含規則。

Gradle 僅在宣告不符合任何排除規則時，才會將其包含在 ABI 傾印中。當定義了包含規則時，宣告必須符合其中一項規則，或者至少有一個成員符合規則。

規則可以基於：

* 類別、屬性或函式的完全限定名稱 (`byNames`)。
* 具有 BINARY 或 RUNTIME [存留期 (retention)](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.annotation/-retention/) 的註解名稱 (`annotatedWith`)。

> 您可以在規則中的名稱使用萬用字元 `**`、`*` 和 `?`：
> * `**` 匹配零個或多個字元，包括句點。
> * `*` 匹配零個或多個字元，不包括句點。使用此符號來指定單一類別名稱。
> * `?` 準確匹配一個字元。
> 
{style = "tip"}

例如：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        filters {
            excluded {
                byNames.add("**.InternalUtils")
                annotatedWith.add("com.example.annotations.InternalApi")
            }

            included {
                byNames.add("com.example.api.**")
                annotatedWith.add("com.example.annotations.PublicApi")
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    abiValidation {
        filters {
            excluded {
                byNames.add("**.InternalUtils")
                annotatedWith.add("com.example.annotations.InternalApi")
            }

            included {
                byNames.add("com.example.api.**")
                annotatedWith.add("com.example.annotations.PublicApi")
            }
        }
    }
}
```

</tab>
</tabs>

此範例：

* 排除：
  * `InternalUtils` 類別。
  * 帶有 `@InternalApi` 註解的宣告。
* 包含：
  * `com.example.api` 套件中的所有內容。
  * 帶有 `@PublicApi` 註解的宣告。

若要進一步了解篩選，請參閱 [Kotlin Gradle 外掛程式 API 參考](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.dsl.abi/-abi-filters-spec/)。

## 防止不受支援目標的推論變更

在多平台專案中，如果您的主機系統無法編譯所有目標，Kotlin Gradle 外掛程式會嘗試從可用目標推論 ABI 變更。這有助於避免日後切換到支援更多目標的主機時出現誤報失敗。

若要停用此行為，請在您的 `build.gradle.kts` 檔案中加入以下內容：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        keepLocallyUnsupportedTargets.set(false)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    abiValidation {
        keepLocallyUnsupportedTargets = false
    }
}
```

</tab>
</tabs>

如果目標不受支援且推論已停用，則 `checkKotlinAbi` 任務會失敗，因為它無法產生完整的 ABI 傾印。如果您希望任務失敗，而不是冒著遺漏二進位不相容變更的風險，那麼此行為可能會很有用。

## 包含來自 `maven-publish` 外掛程式的發佈

預設情況下，二進位相容性驗證使用 Kotlin 編譯輸出來產生 ABI 傾印。因此，產生的 ABI 傾印可能無法反映最終發佈的產物 (artifacts)。例如，當您使用 [`maven-publish` 外掛程式](https://docs.gradle.org/current/userguide/publishing_maven.html)時，重新定位 (relocation) 等後置處理步驟可能會在編譯後修改產物。

若要確保 ABI 傾印精準反映由 `maven-publish` 外掛程式發佈的產物，請在您的 `build.gradle.kts` 檔案中加入以下內容：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        binariesSource.set(MAVEN_PUBLICATIONS)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    abiValidation {
        binariesSource = MAVEN_PUBLICATIONS
    }
}
```

</tab>
</tabs>

> 由於 Kotlin/Android 專案以及具有 Android 目標的多平台專案不會發佈 JAR 檔案，因此此功能不適用於這些專案。
> 
{style="warning"}