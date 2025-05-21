---
title: "No-arg 컴파일러 플러그인"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

*no-arg* 컴파일러 플러그인은 특정 어노테이션이 있는 클래스에 대해 추가적인 매개변수 없는 생성자를 생성합니다.

생성된 생성자는 synthetic이므로 Java나 Kotlin에서 직접 호출할 수는 없지만, 리플렉션을 사용하여 호출할 수 있습니다.

이를 통해 Java Persistence API (JPA)는 Kotlin 또는 Java 관점에서 매개변수 없는 생성자가 없더라도 클래스를 인스턴스화할 수 있습니다 (자세한 내용은 [`kotlin-jpa` 플러그인 설명 참조](#jpa-support)).

## Kotlin 파일에서

매개변수 없는 생성자가 필요한 코드를 표시하기 위해 새로운 어노테이션을 추가하세요:

```kotlin
package com.my

annotation class Annotation
```

## Gradle

Gradle의 plugins DSL을 사용하여 플러그인을 추가하세요:

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("plugin.noarg") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.noarg" version "2.1.20"
}
```

</TabItem>
</Tabs>

그런 다음, 어노테이션이 달린 클래스에 대해 매개변수 없는 생성자를 생성하도록 유도해야 하는 no-arg 어노테이션 목록을 지정하세요:

```groovy
noArg {
    annotation("com.my.Annotation")
}
```

플러그인이 synthetic 생성자에서 초기화 로직을 실행하도록 하려면 `invokeInitializers` 옵션을 활성화하세요. 기본적으로 비활성화되어 있습니다.

```groovy
noArg {
    invokeInitializers = true
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
            <!-- Or "jpa" for JPA support -->
<plugin>no-arg</plugin>
        </compilerPlugins>
<pluginOptions>
            <option>no-arg:annotation=com.my.Annotation</option>
            <!-- Call instance initializers in the synthetic constructor -->
            <!-- <option>no-arg:invokeInitializers=true</option> -->
        </pluginOptions>
    </configuration>

    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-noarg</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
    </dependencies>
</plugin>
```

## JPA 지원

`all-open` 위에 래핑된 `kotlin-spring` 플러그인과 마찬가지로, `kotlin-jpa`는 `no-arg` 위에 래핑됩니다. 이 플러그인은
[`@Entity`](https://docs.oracle.com/javaee/7/api/javax/persistence/Entity.html), [`@Embeddable`](https://docs.oracle.com/javaee/7/api/javax/persistence/Embeddable.html)
및 [`@MappedSuperclass`](https://docs.oracle.com/javaee/7/api/javax/persistence/MappedSuperclass.html)
*no-arg* 어노테이션을 자동으로 지정합니다.

Gradle plugins DSL을 사용하여 플러그인을 추가하세요:

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("plugin.jpa") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.jpa" version "2.1.20"
}
```

</TabItem>
</Tabs>

Maven에서 `jpa` 플러그인을 활성화하세요:

```xml
<compilerPlugins>
<plugin>jpa</plugin>
</compilerPlugins>
```

## Command-line compiler

컴파일러 플러그인 클래스 경로에 플러그인 JAR 파일을 추가하고 어노테이션 또는 프리셋을 지정하세요:

```bash
-Xplugin=$KOTLIN_HOME/lib/noarg-compiler-plugin.jar
-P plugin:org.jetbrains.kotlin.noarg:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.noarg:preset=jpa
```