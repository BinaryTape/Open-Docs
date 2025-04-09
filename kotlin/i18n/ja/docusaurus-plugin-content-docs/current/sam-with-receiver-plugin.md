---
title: "SAM-with-receiver コンパイラプラグイン"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

*sam-with-receiver* コンパイラプラグインは、アノテーションが付与された Java の「単一抽象メソッド (SAM: Single Abstract Method)」インターフェースメソッドの最初のパラメータを Kotlin のレシーバにします。この変換は、SAM インターフェースが Kotlin ラムダとして渡される場合にのみ機能します。SAM アダプタと SAM コンストラクタの両方で機能します (詳細については、[SAM conversions documentation](java-interop#sam-conversions)を参照してください)。

例を以下に示します。

```java
public @interface SamWithReceiver {}

@SamWithReceiver
public interface TaskRunner {
    void run(Task task);
}
```

```kotlin
fun test(context: TaskContext) {
    val runner = TaskRunner {
        // ここでは 'this' は 'Task' のインスタンスです

        println("$name is started")
        context.executeTask(this)
        println("$name is finished")
    }
}
```

## Gradle

使い方は、[all-open](all-open-plugin) および [no-arg](no-arg-plugin) と同じですが、sam-with-receiver には組み込みのプリセットがなく、特別な扱いをするアノテーションのリストを自分で指定する必要がある点が異なります。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("plugin.sam.with.receiver") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.sam.with.receiver" version "2.1.20"
}
```

</TabItem>
</Tabs>

次に、SAM-with-receiver アノテーションのリストを指定します。

```groovy
samWithReceiver {
    annotation("com.my.SamWithReceiver")
}
```

## Maven

```xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>

    <configuration>
        <compilerPlugins>
<plugin>sam-with-receiver</plugin>
        </compilerPlugins>
<pluginOptions>
            <option>
                sam-with-receiver:annotation=com.my.SamWithReceiver
            </option>
        </pluginOptions>
    </configuration>

    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-sam-with-receiver</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
    </dependencies>
</plugin>
```

## Command-line compiler

プラグイン JAR ファイルをコンパイラプラグインのクラスパスに追加し、sam-with-receiver アノテーションのリストを指定します。

```bash
-Xplugin=$KOTLIN_HOME/lib/sam-with-receiver-compiler-plugin.jar
-P plugin:org.jetbrains.kotlin.samWithReceiver:annotation=com.my.SamWithReceiver
```