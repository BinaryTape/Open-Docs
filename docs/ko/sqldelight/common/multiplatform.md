# 멀티플랫폼

코틀린 멀티플랫폼에서 SQLDelight를 사용하려면 코드를 생성할 패키지를 지정하여 Gradle 플러그인을 설정하세요.

```groovy
apply plugin: "org.jetbrains.kotlin.multiplatform"
apply plugin: "app.cash.sqldelight"

sqldelight {
  databases {
    MyDatabase {
      packageName = "com.example.hockey"
    }
  }
}
```

`.sq` 파일들을 `src/commonMain/sqldelight` 디렉터리에 넣으세요. 그런 다음 `Database`를 생성할 때 각 플랫폼에서 `SqlDriver`가 제공되도록 `expect` 키워드를 사용하세요. 마이그레이션 파일 또한 동일한 `src/commonMain/sqldelight` 디렉터리에 있어야 합니다.