# RxJava

쿼리를 관찰(observe)하려면 RxJava 확장(extensions) 아티팩트의 의존성을 추가하고, 해당 아티팩트에서 제공하는 확장 메서드를 사용하세요:

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

_참고: RxJava 2의 경우, 아티팩트 이름으로 `rxjava2-extensions`를 사용하세요._