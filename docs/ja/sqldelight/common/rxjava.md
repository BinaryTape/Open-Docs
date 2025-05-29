# RxJava

クエリを監視するには、RxJava extensions artifact に依存し、提供されている拡張メソッドを使用します。

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

_注: RxJava 2 の場合、`rxjava2-extensions` を artifact 名として使用してください。_