## 스키마 종속성

다른 모듈에 대한 스키마 종속성을 지정할 수 있습니다:

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

이는 `ProjectB`에서 `MyDatabase`를 찾아 컴파일 시 해당 스키마를 포함시킵니다. 이를 위해 `ProjectB`는 동일한 이름(이 경우 `MyDatabase`)의 데이터베이스를 가지고 있어야 하지만, 다른 패키지에서 생성되어야 합니다. 다음은 `ProjectB`의 Gradle 파일이 어떻게 생겼을지 보여줍니다:

=== "Kotlin"
    ```kotlin hl_lines="4"
    // project-b/build.gradle.kts

    sqldelight {
      databases {
        // Same database name
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
        // Same database name
        MyDatabase {
          package = "com.example.projectb"
        }
      }
    }
    ```
`deriveSchemaFromMigrations = true`를 사용하는 경우, 이 모듈에 종속된 모든 모듈도 이 기능을 활성화해야 합니다.