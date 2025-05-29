## 結構描述相依性

您可以指定另一個模組上的結構描述相依性：

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

這會在 `ProjectB` 中尋找 `MyDatabase`，並在編譯時包含其結構描述。為此，`ProjectB` 必須具有相同名稱的資料庫（在此情況下為 `MyDatabase`），但需在不同的套件中生成。以下是 `ProjectB` 的 Gradle 配置範例：

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
如果您使用 `deriveSchemaFromMigrations = true`，則每個依賴此模組的模組也必須啟用此功能。