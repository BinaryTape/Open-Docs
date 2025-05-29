# 멀티플랫폼

Kotlin 멀티플랫폼에서 SQLDelight를 사용하려면 코드를 생성할 패키지와 함께 Gradle 플러그인을 설정해야 합니다.

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

`.sq` 파일을 `src/commonMain/sqldelight` 디렉토리에 배치하고, `Database`를 생성할 때 개별 플랫폼에서 `SqlDriver`가 `expect`되도록 해야 합니다. 마이그레이션 파일 또한 동일한 `src/commonMain/sqldelight` 디렉토리에 있어야 합니다.