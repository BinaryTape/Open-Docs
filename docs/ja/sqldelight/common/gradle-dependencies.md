## スキーマの依存関係

別のモジュールに対するスキーマの依存関係を指定できます。

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

これは、`ProjectB`内の`MyDatabase`を探し、コンパイル時にそのスキーマを含めます。これが機能するためには、`ProjectB`に同じ名前（この場合は`MyDatabase`）のデータベースがあり、しかし異なるパッケージで生成される必要があります。以下は`ProjectB`のGradle設定の例です。

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
`deriveSchemaFromMigrations = true`を使用する場合、このモジュールに依存するすべてのモジュールもこの機能を有効にする必要があります。