[//]: # (title: 從 kapt 遷移到 KSP)
[//]: # (description: 了解如何將 Kotlin 專案中的註解處理器從 kapt 遷移到 KSP。)

在本指南中，您將學習如何將註解處理器從 [kapt](kapt.md) 遷移到 [KSP](ksp-overview.md)，讓您的專案能充分利用 Kotlin 特性並提升組建效能。

[kapt](kapt.md) (Kotlin Annotation Processing Tool) 是一項實用的工具，可讓您在 Kotlin 中使用 Java 註解處理器。它的運作方式是將 Kotlin 原始碼轉換為 Java「虛設常式 (stubs)」，然後在這些虛設常式上執行註解處理器。然而，這個過程開銷很大，會顯著增加建置時間，且在轉換過程中會遺失某些 Kotlin 特有的特性。

相較之下，[KSP](ksp-overview.md) (Kotlin Symbol Processing) 是專為 Kotlin 設計的 kapt 替代方案。KSP 理解所有 Kotlin 特性並直接分析原始碼，從而減少建置時間。

在開始之前，請檢查專案中的處理器是否支援 KSP。請參閱 [支援的程式庫列表](ksp-overview.md#supported-libraries) 或諮詢其文件。

> KSP 和 kapt 可以並存執行，因此您可以分階段遷移專案，每次遷移一個程式庫或模組。
> 
{style="note"}

## 在專案中加入 KSP 外掛程式

在專案級別的 `build.gradle(.kts)` 檔案中的 `plugins {}` 區塊加入 KSP：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("com.google.devtools.ksp") version "%kspVersion%" apply false 
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'com.google.devtools.ksp' version '%kspVersion%' apply false 
}
```

</tab>
</tabs>

> 若要尋找最新版本的 KSP，請查看 GitHub 的 [發佈 (Releases)](https://github.com/google/ksp/releases) 頁面。
> 
{style="tip"}

## 更新您的處理器

找到使用您想要遷移的處理器的模組。在該模組的 `build.gradle(.kts)` 檔案中：

1. 在 `plugins {}` 區塊加入 KSP：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    plugins {
        id("com.google.devtools.ksp")
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    plugins {
        id 'com.google.devtools.ksp'
    }
    ```

    </tab>
    </tabs>
   
2. 在 `dependencies {}` 區塊，將 `kapt` 替換為 `ksp`：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    dependencies {
        implementation("com.google.dagger:dagger:2.48")
        // kapt("com.google.dagger:dagger-compiler:2.48")
        
        // KSP processor dependency:
        ksp("com.google.dagger:dagger-compiler:2.48") 
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy"> 

    ```groovy
    dependencies {
        implementation 'com.google.dagger:dagger:2.48'
        // kapt 'com.google.dagger:dagger-compiler:2.48'
        
        // KSP processor dependency:
        ksp 'com.google.dagger:dagger-compiler:2.48'
    }
    ```

    </tab>
    </tabs>
    

> 對於大多數程式庫，進行此替換就足夠了。請檢查各程式庫的文件，確認是否需要進行任何額外的變更。
> 
{style="note"}

## 移除 kapt 外掛程式

在將所有處理器遷移到 KSP 後，您可以安全地從所有建置檔案中移除 kapt 外掛程式：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
   // 刪除此行：
    id("org.jetbrains.kotlin.kapt")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    // 刪除此行：
    id 'org.jetbrains.kotlin.kapt'
}
```

</tab>
</tabs>

刪除所有剩餘的 kapt 配置（如果有的話）。

## 下一步？

* 在 [KSP 入門指南](ksp-quickstart.md#create-your-own-processor) 中學習如何製作您自己的基於 KSP 的註解處理器。
* 在 [KSP 存儲庫](https://github.com/google/ksp/tree/main/examples) 中探索使用 KSP 的範例專案。
* 在 [總覽](ksp-overview.md) 中閱讀更多關於 KSP 的資訊。