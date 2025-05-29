[//]: # (title: Lincheck 指南)

Lincheck 是一個實用且使用者友善的框架，用於在 JVM 上測試並發演算法。它提供了一種簡單且宣告式的方式來編寫並發測試。

藉由 Lincheck 框架，您無需描述如何執行測試，而是可以透過宣告所有要檢查的操作和所需的正確性屬性，來指定_要測試什麼_。因此，一個典型的 Lincheck 並發測試通常只包含大約 15 行程式碼。

當給定一系列操作時，Lincheck 會自動執行以下動作：

*   產生一組隨機的並發情境。
*   使用壓力測試 (stress-testing) 或有界模型檢查 (bounded model checking) 來檢查它們。
*   驗證每次調用的結果是否滿足所需的正確性屬性（線性化 (linearizability) 是預設屬性）。

## 將 Lincheck 加入您的專案

要啟用 Lincheck 支援，請將對應的儲存庫 (repository) 和依賴 (dependency) 包含到 Gradle 配置中。在您的 `build.gradle(.kts)` 檔案中，新增以下內容：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
repositories {
    mavenCentral()
}
 
dependencies {
    testImplementation("org.jetbrains.kotlinx:lincheck:%lincheckVersion%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
repositories {
    mavenCentral()
}

dependencies {
    testImplementation "org.jetbrains.kotlinx:lincheck:%lincheckVersion%"
}
```

</tab>
</tabs>

## 探索 Lincheck

本指南將幫助您熟悉此框架並透過範例嘗試其最實用的功能。逐步學習 Lincheck 的功能：

1.  [使用 Lincheck 編寫您的第一個測試](introduction.md)
2.  [選擇您的測試策略](testing-strategies.md)
3.  [配置操作參數](operation-arguments.md)
4.  [考量常見的演算法約束](constraints.md)
5.  [檢查演算法的非阻塞進度保證](progress-guarantees.md)
6.  [定義演算法的序列化規範](sequential-specification.md)

## 延伸參考
*   "我們如何在 Kotlin Coroutines 中測試並發演算法" 作者：Nikita Koval：[影片](https://youtu.be/jZqkWfa11Js)。KotlinConf 2023
*   "Lincheck：在 JVM 上測試並發" 工作坊，作者：Maria Sokolova：[第一部分](https://www.youtube.com/watch?v=YNtUK9GK4pA)，[第二部分](https://www.youtube.com/watch?v=EW7mkAOErWw)。Hydra 2021