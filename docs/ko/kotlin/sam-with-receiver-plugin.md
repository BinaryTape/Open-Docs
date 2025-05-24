---
title: "SAM-with-receiver 컴파일러 플러그인"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

*sam-with-receiver* 컴파일러 플러그인은 어노테이션이 적용된 Java "단일 추상 메서드(single abstract method, SAM)" 인터페이스 메서드의 첫 번째 매개변수를 Kotlin의 receiver로 만듭니다. 이 변환은 SAM 인터페이스가 Kotlin 람다로 전달될 때만 작동하며, SAM 어댑터 및 SAM 생성자 모두에 적용됩니다(자세한 내용은 [SAM conversions documentation](java-interop#sam-conversions) 참조).

다음은 예시입니다.

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
        // 여기서 'this'는 'Task'의 인스턴스입니다.

        println("$name is started")
        context.executeTask(this)
        println("$name is finished")
    }
}
```

## Gradle

사용법은 [all-open](all-open-plugin) 및 [no-arg](no-arg-plugin)와 동일하지만, sam-with-receiver는
내장된 사전 설정이 없으며, 특별히 처리할 어노테이션 목록을 직접 지정해야 한다는 점이 다릅니다.

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

그런 다음 SAM-with-receiver 어노테이션 목록을 지정합니다.

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

컴파일러 플러그인 클래스패스에 플러그인 JAR 파일을 추가하고 sam-with-receiver 어노테이션 목록을 지정합니다.

```bash
-Xplugin=$KOTLIN_HOME/lib/sam-with-receiver-compiler-plugin.jar
-P plugin:org.jetbrains.kotlin.samWithReceiver:annotation=com.my.SamWithReceiver
```