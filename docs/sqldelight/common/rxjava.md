# RxJava

要观察查询，请依赖 RxJava 扩展构件并使用其提供的扩展方法：

=== "Kotlin"
    ```kotlin
    dependencies {
      implementation("app.cash.sqldelight:rxjava3-extensions:{{ versions.sqldelight }}")
    }
    ```
=== "Groovy"
    ```groovy
    dependencies {
      implementation "app.cash.sqldelight:rxjava3-extensions:{{ versions.sqldelight }}"
    }
    ```

```kotlin
val players: Observable<List<HockeyPlayer>> = 
  playerQueries.selectAll()
    .asObservable()
    .mapToList()
```

_注意：对于 RxJava 2，请使用 `rxjava2-extensions` 作为构件名称。_