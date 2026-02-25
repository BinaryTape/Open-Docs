## 架构依赖项

您可以指定对另一个模块的架构依赖项：

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

这会在 `ProjectB` 中查找 `MyDatabase`，并在编译时将其架构包含在内。为了使其正常工作，`ProjectB` 必须拥有一个同名的数据库（在本例中为 `MyDatabase`），但要在不同的软件包中生成。以下是 `ProjectB` 的 Gradle 构建配置示例：

=== "Kotlin"
    ```kotlin hl_lines="4"
    // project-b/build.gradle.kts

    sqldelight {
      databases {
        // 相同的数据库名称
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
        // 相同的数据库名称
        MyDatabase {
          package = "com.example.projectb"
        }
      }
    }
    ```
如果您使用 `deriveSchemaFromMigrations = true`，则依赖于该模块的每个模块也必须启用此功能。