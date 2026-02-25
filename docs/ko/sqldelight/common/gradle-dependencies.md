## 스키마 의존성 (Schema Dependencies)

다른 모듈에 대한 스키마 의존성을 지정할 수 있습니다:

=== "Kotlin"
    ```kotlin
    // project-a/build.gradle.kts

    sqldelight {
      databases {
        create("MyDatabase") {
          packageName.set("com.example.projecta")
          dependency(project(":ProjectB"))
        }
      }
    }
    ```
=== "Groovy"
    ```groovy
    // project-a/build.gradle

    sqldelight {
      databases {
        MyDatabase {
          packageName = "com.example.projecta"
          dependency project(":ProjectB")
        }
      }
    }
    ```

이 설정은 `ProjectB`에서 `MyDatabase`를 찾아 컴파일할 때 해당 스키마를 포함합니다. 이 기능이 작동하려면 `ProjectB`에 동일한 이름(이 경우 `MyDatabase`)의 데이터베이스가 있어야 하지만 서로 다른 패키지에서 생성되어야 합니다. `ProjectB`의 Gradle 설정은 다음과 같습니다:

=== "Kotlin"
    ```kotlin hl_lines="4"
    // project-b/build.gradle.kts

    sqldelight {
      databases {
        // 동일한 데이터베이스 이름
        create("MyDatabase") {
          package = "com.example.projectb"
        }
      }
    }
    ```
=== "Groovy"
    ```groovy hl_lines="4"
    // project-b/build.gradle

    sqldelight {
      databases {
        // 동일한 데이터베이스 이름
        MyDatabase {
          package = "com.example.projectb"
        }
      }
    }
    ```
`deriveSchemaFromMigrations = true`를 사용하는 경우, 이 모듈을 의존하는 모든 모듈에서도 이 기능을 활성화해야 합니다.