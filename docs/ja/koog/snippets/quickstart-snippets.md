---
search:
exclude: true
---

# --8<-- [start:prerequisites]
環境およびプロジェクトが以下の要件を満たしていることを確認してください：

- JDK 17+
- Kotlin 2.2.0+
- Gradle 8.0+ または Maven 3.8+
# --8<-- [end:prerequisites]

# --8<-- [start:dependencies]
[Koogパッケージ](https://central.sonatype.com/artifact/ai.koog/koog-agents/)を依存関係として追加します：

=== "Gradle (Kotlin)"

    ``` kotlin title="build.gradle.kts"
    dependencies {
        implementation("ai.koog:koog-agents:1.0.0")
    }
    ```

=== "Gradle (Groovy)"

    ``` groovy title="build.gradle"
    dependencies {
        implementation 'ai.koog:koog-agents:1.0.0'
    }
    ```

=== "Maven"

    ```xml title="pom.xml"
    <dependency>
        <groupId>ai.koog</groupId>
        <artifactId>koog-agents-jvm</artifactId>
        <version>0.7.1</version>
    </dependency>
    ```
# --8<-- [end:dependencies]

# --8<-- [start:api-key]
LLMプロバイダーからAPIキーを取得するか、Ollamaを介してローカルLLMを実行してください。
詳細については、[クイックスタート](/quickstart.md)を参照してください。
# --8<-- [end:api-key]