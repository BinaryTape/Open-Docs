# RxJava

クエリをオブザーブするには、RxJava 拡張アーティファクトへの依存関係を追加し、提供される拡張メソッドを使用します。

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

*注意: RxJava 2 の場合は、アーティファクト名として `rxjava2-extensions` を使用してください。*