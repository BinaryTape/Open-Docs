[//]: # (title: Lincheck 指南)

Lincheck 是一個實用且易於使用的架構，用於在 JVM 上測試並行演算法。它提供了一種簡單且宣告式的方式來編寫並行測試。

使用 Lincheck 架構，您不需要描述如何執行測試，而是可以透過宣告所有要檢查的操作和所需的正確性屬性來指定 *要測試什麼*。因此，一個典型的並行 Lincheck 測試僅包含約 15 行程式碼。

當提供操作清單時，Lincheck 會自動：

*   產生一組隨機並行案例。
*   使用壓力測試或有界模型檢查來檢查這些案例。
*   驗證每次呼叫的結果是否滿足所需的正確性屬性（預設為線性化）。

## 在您的專案中加入 Lincheck

若要啟用 Lincheck 支援，請在 Gradle 配置中包含對應的存儲庫和相依性。在您的 `build.gradle(.kts)` 檔案中加入以下內容：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
repositories {
    mavenCentral()
}
 
dependencies {
    testImplementation("org.jetbrains.lincheck:lincheck:%lincheckVersion%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
repositories {
    mavenCentral()
}

dependencies {
    testImplementation "org.jetbrains.lincheck:lincheck:%lincheckVersion%"
}
```

</tab>
</tabs>

## 探索 Lincheck

本指南將協助您接觸該架構，並透過範例嘗試最實用的功能。逐步學習 Lincheck 特性：

1. [使用 Lincheck 編寫您的第一個測試](introduction.md)
2. [選擇您的測試策略](testing-strategies.md)
3. [配置操作引數](operation-arguments.md)
4. [考慮常見的演算法限制](constraints.md)
5. [檢查演算法的非阻塞進展保證](progress-guarantees.md)
6. [定義演算法的順序規格](sequential-specification.md)

## 其他參考資料
*   Nikita Koval 的 "How we test concurrent algorithms in Kotlin Coroutines"：[影片](https://youtu.be/jZqkWfa11Js)。KotlinConf 2023
*   Maria Sokolova 的 "Lincheck: Testing concurrency on the JVM" 工作坊：[第 1 部分](https://www.youtube.com/watch?v=YNtUK9GK4pA)，[第 2 部分](https://www.youtube.com/watch?v=EW7mkAOErWw)。Hydra 2021