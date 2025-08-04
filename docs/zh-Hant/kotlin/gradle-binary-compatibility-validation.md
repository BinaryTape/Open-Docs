[//]: # (title: Kotlin Gradle 外掛程式中的二進位相容性驗證)

<primary-label ref="experimental-general"/>

二進位相容性驗證可協助函式庫作者確保使用者在升級至新版本時不會破壞其程式碼。這不僅對於提供流暢的升級體驗至關重要，也對於與使用者建立長期信任、鼓勵持續採用該函式庫非常重要。

> 二進位相容性表示函式庫兩個版本的編譯位元組碼可以互換執行，而無需重新編譯。
> 
{style="tip"}

從 2.2.0 版開始，Kotlin Gradle 外掛程式支援二進位相容性驗證。啟用後，它會從目前的程式碼產生應用程式二進位介面 (ABI) 傾印，並與先前的傾印進行比較，以突顯差異。您可以檢閱這些變更，以找出任何潛在的二進位不相容修改，並採取行動加以解決。

## 如何啟用

若要啟用二進位相容性驗證，請將以下內容新增至 `build.gradle.kts` 檔案中的 `kotlin{}` 區塊：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        // 使用 set() 函式確保與舊版 Gradle 相容
        enabled.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
kotlin {
    abiValidation {
        enabled = true
    }
}
```

</tab>
</tabs>

如果您的專案有多個模組需要檢查二進位相容性，請單獨配置每個模組。

## 檢查二進位相容性問題

若要檢查程式碼變更後潛在的二進位不相容問題，請在 IntelliJ IDEA 中執行 `checkLegacyAbi` Gradle 工作，或在您的專案目錄中使用以下命令：

```kotlin
./gradlew checkLegacyAbi
```

此工作會比較 ABI 傾印並將任何偵測到的差異作為錯誤列印。請仔細檢查輸出，看看是否需要變更程式碼以保持二進位相容性。

## 更新參考 ABI 傾印

若要更新 Gradle 用於檢查最新變更的參考 ABI 傾印，請在 IntelliJ IDEA 中執行 `updateLegacyAbi` 工作，或在您的專案目錄中使用以下命令：

```kotlin
./gradlew updateLegacyAbi
```

僅在您確信變更與舊版本保持二進位相容性時才更新參考傾印。

## 設定篩選器

您可以定義篩選器來控制 ABI 傾印包含哪些類別、屬性與函式。使用 `filters {}` 區塊分別透過 `excluded {}` 和 `included {}` 區塊新增排除和包含規則。

Gradle 僅在宣告不符合任何排除規則時才將其包含在 ABI 傾印中。定義包含規則時，宣告必須符合其中之一，或至少有一個成員符合。

規則可以基於：

*   類別、屬性或函式的完整合格名稱 (`byNames`)。
*   具有 BINARY 或 RUNTIME [保留](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.annotation/-retention/)的註解名稱 (`annotatedWith`)。

> 您可以在名稱規則中使用萬用字元 `**`、`*` 和 `?`：
> *   `**` 符合零個或多個字元，包括句點。
> *   `*` 符合零個或多個字元，不包括句點。使用此項可指定單一類別名稱。
> *   `?` 精確符合一個字元。
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

```kotlin
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

*   排除：
    *   `InternalUtils` 類別。
    *   標註有 `@InternalApi` 的宣告。
*   包含：
    *   `com.example.api` 套件中的所有內容。
    *   標註有 `@PublicApi` 的宣告。

若要深入了解篩選，請參閱 [Kotlin Gradle 外掛程式 API 參考](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.dsl.abi/-abi-filters-spec/)。

## 防止對不支援目標進行推斷變更

在多平台專案中，如果您的主機系統無法編譯所有目標，Kotlin Gradle 外掛程式會嘗試從可用目標推斷 ABI 變更。這有助於避免當您稍後切換到支援更多目標的主機時產生錯誤失敗。

若要停用此行為，請將以下內容新增至您的 `build.gradle.kts` 檔案：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        klib {
            keepUnsupportedTargets.set(false)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
kotlin {
    abiValidation {
        klib {
            keepUnsupportedTargets = false
        }
    }
}
```

</tab>
</tabs>

如果目標不受支援且推斷已停用，`checkLegacyAbi` 工作將會失敗，因為它無法產生完整的 ABI 傾印。如果您寧願工作失敗也不願冒險錯過二進位不相容的變更，此行為可能很有用。