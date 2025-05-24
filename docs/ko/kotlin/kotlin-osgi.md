---
title: "Kotlin 및 OSGi"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin 프로젝트에서 Kotlin [OSGi](https://www.osgi.org/) 지원을 활성화하려면 일반 Kotlin 라이브러리 대신 `kotlin-osgi-bundle`을 포함하세요. `kotlin-osgi-bundle`에 `kotlin-runtime`, `kotlin-stdlib` 및 `kotlin-reflect` 종속성이 모두 포함되어 있으므로 이러한 종속성을 제거하는 것이 좋습니다. 또한 외부 Kotlin 라이브러리가 포함된 경우 주의해야 합니다. 대부분의 일반 Kotlin 종속성은 OSGi를 지원하지 않으므로 사용하지 말고 프로젝트에서 제거해야 합니다.

## Maven

Kotlin OSGi 번들을 Maven 프로젝트에 포함하려면 다음을 수행하세요.

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-osgi-bundle</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

외부 라이브러리에서 표준 라이브러리를 제외하려면 (Maven 3에서만 "별표 제외"가 작동함):

```xml
<dependency>
    <groupId>some.group.id</groupId>
    <artifactId>some.library</artifactId>
    <version>some.library.version</version>

    <exclusions>
        <exclusion>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>*</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

## Gradle

Gradle 프로젝트에 `kotlin-osgi-bundle`을 포함하려면 다음을 수행하세요.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
dependencies {
    implementation(kotlin("osgi-bundle"))
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
dependencies {
    implementation "org.jetbrains.kotlin:kotlin-osgi-bundle:2.1.20"
}
```

</TabItem>
</Tabs>

전이 종속성으로 제공되는 기본 Kotlin 라이브러리를 제외하려면 다음 방법을 사용할 수 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
dependencies {
    implementation("some.group.id:some.library:someversion") {
        exclude(group = "org.jetbrains.kotlin")
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
dependencies {
    implementation('some.group.id:some.library:someversion') {
        exclude group: 'org.jetbrains.kotlin'
    }
}
```

</TabItem>
</Tabs>

## FAQ

### 모든 Kotlin 라이브러리에 필요한 매니페스트 옵션을 추가하지 않는 이유는 무엇입니까?

OSGi 지원을 제공하는 가장 선호되는 방법이기는 하지만, 불행히도 소위
["package split" issue](https://docs.osgi.org/specification/osgi.core/7.0.0/framework.module.html#d0e5999)로 인해 현재는 불가능하며, 이러한 큰 변경은
현재 계획되어 있지 않습니다. `Require-Bundle` 기능도 있지만 최상의 옵션은 아니며 사용하지 않는 것이 좋습니다.
따라서 OSGi용으로 별도의 아티팩트를 만들기로 결정했습니다.