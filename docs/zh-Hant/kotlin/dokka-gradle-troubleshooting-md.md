[//]: # (title: Dokka Gradle 故障排除)

本頁說明在使用 Dokka 於 Gradle 建置中產生文件時，您可能會遇到的常見問題。

如果您的問題未列於此處，請在我們的 [問題追蹤器](https://kotl.in/dokka-issues) 中回報任何意見回饋或問題，或在官方 [Kotlin Slack](https://kotlinlang.slack.com/) 中與 Dokka 社群交流。在 [這裡](https://kotl.in/slack) 取得 Slack 邀請。

## 記憶體問題

在大型專案中，Dokka 在產生文件時可能會消耗大量記憶體。這可能會超出 Gradle 的記憶體限制，尤其是在處理大量資料時。

當 Dokka 產生器耗盡記憶體時，建置會失敗，且 Gradle 可能會拋出類似 `java.lang.OutOfMemoryError: Metaspace` 的例外狀況。

目前正在積極努力改善 Dokka 的效能，儘管部分限制來自 Gradle 本身。

如果您遇到記憶體問題，請嘗試以下解決方案：

*   [增加堆積空間](#increase-heap-space)
*   [在 Gradle 處理程序內執行 Dokka](#run-dokka-within-the-gradle-process)

### 增加堆積空間

解決記憶體問題的一種方法是，增加供 Dokka 產生器處理程序使用的 Java 堆積記憶體量。在 `build.gradle.kts` 檔案中，調整以下設定選項：

```kotlin
    dokka {
        // Dokka 會產生一個由 Gradle 管理的新處理程序
        dokkaGeneratorIsolation = ProcessIsolation {
            // 設定堆積大小
            maxHeapSize = "4g"
        }
    }
```

在此範例中，最大堆積大小設定為 4 GB (`"4g"`)。調整並測試此值，以找出適用於您建置的最佳設定。

如果您發現 Dokka 需要大幅擴展的堆積大小，例如，顯著高於 Gradle 本身的記憶體用量，請在 [Dokka 的 GitHub 儲存庫上建立問題](https://kotl.in/dokka-issues)。

> 您必須將此設定套用到每個子專案。建議您在套用到所有子專案的慣例外掛程式中設定 Dokka。
>
{style="note"}

### 在 Gradle 處理程序內執行 Dokka

當 Gradle 建置和 Dokka 產生器都需要大量記憶體時，它們可能會以獨立的處理程序執行，在單一機器上消耗大量記憶體。

為了最佳化記憶體使用量，您可以在相同的 Gradle 處理程序內執行 Dokka，而不是作為獨立的處理程序。這讓您可以為 Gradle 一次性設定記憶體，而不是為每個處理程序單獨分配。

若要在相同的 Gradle 處理程序內執行 Dokka，請在 `build.gradle.kts` 檔案中調整以下設定選項：

```kotlin
    dokka {
        // 在目前的 Gradle 處理程序中執行 Dokka
        dokkaGeneratorIsolation = ClassLoaderIsolation()
    }
```

如同 [增加堆積空間](#increase-heap-space) 的做法，請測試此設定以確認其適用於您的專案。

如需有關設定 Gradle JVM 記憶體的更多詳細資訊，請參閱 [Gradle 文件](https://docs.gradle.org/current/userguide/config_gradle.html#sec:configuring_jvm_memory)。

> 變更 Gradle 的 Java 選項會啟動新的 Gradle 守護程序 (daemon)，該守護程序可能會長時間保持活動狀態。您可以 [手動停止任何其他 Gradle 處理程序](https://docs.gradle.org/current/userguide/gradle_daemon.html#sec:stopping_an_existing_daemon)。
>
> 此外，`ClassLoaderIsolation()` 設定的 Gradle 問題可能 [會導致記憶體洩漏](https://github.com/gradle/gradle/issues/18313)。
>
{style="note"}