---
title: "1つのプロジェクトでJavaとKotlinを混在させる方法 – チュートリアル"
---
KotlinはJavaとの高度な相互運用性（interoperability）を備えており、最新のIDEを使用することでさらに使いやすくなります。
このチュートリアルでは、IntelliJ IDEAでKotlinとJavaの両方のソースを同じプロジェクトで使用する方法を学びます。IntelliJ IDEAで新しいKotlinプロジェクトを開始する方法については、[Getting started with IntelliJ IDEA](jvm-get-started)を参照してください。

## 既存のKotlinプロジェクトにJavaソースコードを追加する

KotlinプロジェクトへのJavaクラスの追加は非常に簡単です。必要なのは、新しいJavaファイルを作成することだけです。プロジェクト内のディレクトリまたはパッケージを選択し、**File** | **New** | **Java Class** に移動するか、**Alt + Insert**/**Cmd + N** ショートカットを使用します。

<img src="/img/new-java-class.png" alt="Add new Java class" width="400" style={{verticalAlign: 'middle'}}/>

すでにJavaクラスがある場合は、それらをプロジェクトディレクトリにコピーするだけです。

これで、それ以上の操作なしに、KotlinからJavaクラスを使用したり、その逆も可能になります。
 
たとえば、次のJavaクラスを追加するとします。

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

Kotlinでは、Kotlinの他の型と同様に呼び出すことができます。

```kotlin
val customer = Customer("Phase")
println(customer.name)
println(customer.placeOrder())
```

## 既存のJavaプロジェクトにKotlinソースコードを追加する

既存のJavaプロジェクトへのKotlinファイルの追加もほとんど同じです。

<img src="/img/new-kotlin-file.png" alt="Add new Kotlin file class" width="400" style={{verticalAlign: 'middle'}}/>

このプロジェクトにKotlinファイルを追加するのが初めての場合、IntelliJ IDEAは必要なKotlinランタイムを自動的に追加します。

<img src="/img/bundling-kotlin-option.png" alt="Bundling Kotlin runtime" width="350" style={{verticalAlign: 'middle'}}/>

**Tools** | **Kotlin** | **Configure Kotlin in Project** からKotlinランタイム構成を手動で開くこともできます。

## J2Kを使用して既存のJavaファイルをKotlinに変換する

Kotlinプラグインには、JavaファイルをKotlinに自動的に変換するJava to Kotlinコンバーター（_J2K_）もバンドルされています。
ファイルでJ2Kを使用するには、コンテキストメニューまたはIntelliJ IDEAの **Code** メニューで **Convert Java File to Kotlin File** をクリックします。

<img src="/img/convert-java-to-kotlin.png" alt="Convert Java to Kotlin" width="500" style={{verticalAlign: 'middle'}}/>

コンバーターは完璧ではありませんが、ほとんどのボイラープレートコードをJavaからKotlinに変換するのに適しています。ただし、手動での調整が必要になる場合があります。