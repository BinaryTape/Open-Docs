## 模式依赖

你可以指定对另一个模块的模式依赖：

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

这会在 `ProjectB` 中查找 `MyDatabase` 并在编译时包含其模式。为了使其正常工作，`ProjectB` 必须有一个相同名称的数据库（本例中为 `MyDatabase`），但生成到不同的包中，所以 `ProjectB` 的 Gradle 配置可能如下所示：

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
如果你使用 `deriveSchemaFromMigrations = true`，那么依赖此模块的每个模块也必须启用此特性。