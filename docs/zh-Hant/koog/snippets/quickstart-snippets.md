---
search:
exclude: true
---

# --8<-- [start:prerequisites]
確保您的環境與專案符合以下需求：

- JDK 17+
- Kotlin 2.2.0+
- Gradle 8.0+ 或 Maven 3.8+
# --8<-- [end:prerequisites]

# --8<-- [start:dependencies]
將 [Koog 軟件包](https://central.sonatype.com/artifact/ai.koog/koog-agents/) 新增為相依性：

=== "Gradle (Kotlin)"

    ``` kotlin title="build.gradle.kts"
    dependencies {
        implementation("ai.koog:koog-agents:0.6.4")
    }
    ```

=== "Gradle (Groovy)"

    ``` groovy title="build.gradle"
    dependencies {
        implementation 'ai.koog:koog-agents:0.6.4'
    }
    ```

=== "Maven"

    ```xml title="pom.xml"
    <dependency>
        <groupId>ai.koog</groupId>
        <artifactId>koog-agents-jvm</artifactId>
        <version>0.6.4</version>
    </dependency>
    ```
# --8<-- [end:dependencies]

# --8<-- [start:api-key]
從 LLM 提供商獲取 API key，或透過 Ollama 執行本機 LLM。
若要了解更多資訊，請參閱 [快速入門](/quickstart.md)。
# --8<-- [end:api-key]