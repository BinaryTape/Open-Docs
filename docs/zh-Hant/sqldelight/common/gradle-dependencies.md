## 架構相依性

您可以對另一個模組指定架構相依性：

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

這會在 `ProjectB` 中尋找 `MyDatabase`，並在編譯時包含其架構。為了讓其運作，`ProjectB` 必須具有相同名稱的資料庫（在此範例中為 `MyDatabase`），但產生在不同的套件中，以下是 `ProjectB` 的 Gradle 設定可能的外觀：

=== "Kotlin"
    ```kotlin hl_lines="4"
    // project-b/build.gradle.kts

    sqldelight {
      databases {
        // 相同的資料庫名稱
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
        // 相同的資料庫名稱
        MyDatabase {
          package = "com.example.projectb"
        }
      }
    }
    ```
如果您使用 `deriveSchemaFromMigrations = true`，則每個相依於此模組的模組也必須啟用此功能。