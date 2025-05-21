---
title: "하나의 프로젝트에서 Java와 Kotlin 혼합 사용 – 튜토리얼"
---
Kotlin은 Java와 동등한 수준의 상호 운용성을 제공하며, 최신 IDE는 이를 더욱 향상시킵니다.
이 튜토리얼에서는 IntelliJ IDEA에서 Kotlin 및 Java 소스를 동일한 프로젝트에서 사용하는 방법을 알아봅니다. IntelliJ IDEA에서 새로운 Kotlin 프로젝트를 시작하는 방법은 [IntelliJ IDEA 시작하기](jvm-get-started)를 참조하세요.

## 기존 Kotlin 프로젝트에 Java 소스 코드 추가하기

Kotlin 프로젝트에 Java 클래스를 추가하는 것은 매우 간단합니다. 새로운 Java 파일을 만들기만 하면 됩니다. 프로젝트 내에서 디렉토리 또는 패키지를 선택하고 **File** | **New** | **Java Class**로 이동하거나 **Alt + Insert**/**Cmd + N** 단축키를 사용하세요.

<img src="/img/new-java-class.png" alt="Add new Java class" width="400" style={{verticalAlign: 'middle'}}/>

이미 Java 클래스가 있는 경우 프로젝트 디렉토리에 복사하기만 하면 됩니다.

이제 추가 작업 없이 Kotlin에서 Java 클래스를 사용하거나 그 반대로 사용할 수 있습니다.
 
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

Kotlin의 다른 타입처럼 Kotlin에서 호출할 수 있습니다.

```kotlin
val customer = Customer("Phase")
println(customer.name)
println(customer.placeOrder())
```

## 기존 Java 프로젝트에 Kotlin 소스 코드 추가하기

기존 Java 프로젝트에 Kotlin 파일을 추가하는 것도 거의 동일합니다.

<img src="/img/new-kotlin-file.png" alt="Add new Kotlin file class" width="400" style={{verticalAlign: 'middle'}}/>

이 프로젝트에 Kotlin 파일을 처음 추가하는 경우 IntelliJ IDEA에서 필요한 Kotlin 런타임을 자동으로 추가합니다.

<img src="/img/bundling-kotlin-option.png" alt="Bundling Kotlin runtime" width="350" style={{verticalAlign: 'middle'}}/>

**Tools** | **Kotlin** | **Configure Kotlin in Project**에서 Kotlin 런타임 구성을 수동으로 열 수도 있습니다.

## J2K를 사용하여 기존 Java 파일을 Kotlin으로 변환하기

Kotlin 플러그인에는 Java 파일을 Kotlin으로 자동 변환하는 Java to Kotlin 컨버터(_J2K_)도 함께 제공됩니다.
파일에서 J2K를 사용하려면 해당 컨텍스트 메뉴 또는 IntelliJ IDEA의 **Code** 메뉴에서 **Convert Java File to Kotlin File**을 클릭하세요.

<img src="/img/convert-java-to-kotlin.png" alt="Convert Java to Kotlin" width="500" style={{verticalAlign: 'middle'}}/>

컨버터가 완벽하지는 않지만 대부분의 상용구 코드를 Java에서 Kotlin으로 변환하는 데 상당히 효과적입니다.
그러나 때로는 약간의 수동 조정이 필요합니다.