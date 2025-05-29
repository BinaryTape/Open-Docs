[//]: # (title: SAM-with-receiver 컴파일러 플러그인)

*sam-with-receiver* 컴파일러 플러그인은 어노테이션이 적용된 Java의 "단일 추상 메서드"(SAM) 인터페이스 메서드의 첫 번째 매개변수를 Kotlin에서 리시버(receiver)로 만듭니다. 이 변환은 SAM 인터페이스가 Kotlin 람다로 전달될 때만 작동하며, SAM 어댑터와 SAM 생성자 모두에 적용됩니다. (자세한 내용은 [SAM 변환 문서](java-interop.md#sam-conversions)를 참조하십시오).

다음은 예시입니다:

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

사용법은 [all-open](all-open-plugin.md) 및 [no-arg](no-arg-plugin.md) 플러그인과 동일하지만, sam-with-receiver는 내장된 프리셋이 없으므로 특별히 처리할 어노테이션 목록을 직접 지정해야 합니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("plugin.sam.with.receiver") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.sam.with.receiver" version "%kotlinVersion%"
}
```

</tab>
</tabs>

그런 다음 SAM-with-receiver 어노테이션 목록을 지정합니다:

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

## 명령줄 컴파일러

플러그인 JAR 파일을 컴파일러 플러그인 클래스패스에 추가하고 sam-with-receiver 어노테이션 목록을 지정합니다:

```bash
-Xplugin=$KOTLIN_HOME/lib/sam-with-receiver-compiler-plugin.jar
-P plugin:org.jetbrains.kotlin.samWithReceiver:annotation=com.my.SamWithReceiver