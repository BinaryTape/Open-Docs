# RxJava

若要觀察查詢，請依賴 RxJava 擴充功能構件並使用其提供的擴充方法：

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

_註：對於 RxJava 2，請使用 `rxjava2-extensions` 作為構件名稱。_