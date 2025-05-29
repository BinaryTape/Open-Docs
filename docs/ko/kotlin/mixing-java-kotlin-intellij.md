[//]: # (title: 하나의 프로젝트에서 Java와 Kotlin 혼합 사용하기 – 튜토리얼)

Kotlin은 Java와의 최고 수준의 상호 운용성을 제공하며, 최신 IDE는 이를 더욱 향상시킵니다. 이 튜토리얼에서는 IntelliJ IDEA에서 동일한 프로젝트 내에서 Kotlin과 Java 소스를 모두 사용하는 방법을 배웁니다. IntelliJ IDEA에서 새 Kotlin 프로젝트를 시작하는 방법을 알아보려면 [IntelliJ IDEA 시작하기](jvm-get-started.md)를 참조하세요.

## 기존 Kotlin 프로젝트에 Java 소스 코드 추가하기

Kotlin 프로젝트에 Java 클래스를 추가하는 것은 아주 간단합니다. 새 Java 파일을 생성하기만 하면 됩니다. 프로젝트 내의 디렉터리나 패키지를 선택한 후, **파일** | **새로 만들기** | **Java 클래스**로 이동하거나 **Alt + Insert**/**Cmd + N** 단축키를 사용하세요.

![새 Java 클래스 추가](new-java-class.png){width=400}

이미 Java 클래스가 있다면, 프로젝트 디렉터리에 복사하기만 하면 됩니다.

이제 추가 조치 없이 Kotlin에서 Java 클래스를 사용하거나 그 반대로 사용할 수 있습니다.
 
예를 들어, 다음 Java 클래스를 추가하면:

``` java
public class Customer {

    private String name;

    public Customer(String s){
        name = s;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    public void placeOrder() {
        System.out.println("A new order is placed by " + name);
    }
}
```

Kotlin에서 다른 타입과 마찬가지로 호출할 수 있습니다.

```kotlin
val customer = Customer("Phase")
println(customer.name)
println(customer.placeOrder())
```

## 기존 Java 프로젝트에 Kotlin 소스 코드 추가하기

기존 Java 프로젝트에 Kotlin 파일을 추가하는 것은 거의 동일합니다.

![새 Kotlin 파일 클래스 추가](new-kotlin-file.png){width=400}

이 프로젝트에 Kotlin 파일을 처음 추가하는 경우, IntelliJ IDEA는 필요한 Kotlin 런타임을 자동으로 추가합니다.

![Kotlin 런타임 번들링](bundling-kotlin-option.png){width=350}

또한 **도구** | **Kotlin** | **프로젝트에서 Kotlin 구성**에서 Kotlin 런타임 구성을 수동으로 열 수 있습니다.

## J2K를 사용하여 기존 Java 파일을 Kotlin으로 변환하기

Kotlin 플러그인은 Java 파일을 Kotlin으로 자동 변환하는 Java-Kotlin 변환기(_J2K_)도 함께 제공합니다. 파일에 J2K를 사용하려면, 해당 컨텍스트 메뉴나 IntelliJ IDEA의 **코드** 메뉴에서 **Java 파일을 Kotlin 파일로 변환**을 클릭하세요.

![Java를 Kotlin으로 변환](convert-java-to-kotlin.png){width=500}

이 변환기가 완벽하지는 않지만, 대부분의 Java 상용구(boilerplate) 코드를 Kotlin으로 변환하는 데 꽤 괜찮은 작업을 수행합니다. 하지만 때로는 수동 조정이 필요할 수 있습니다.