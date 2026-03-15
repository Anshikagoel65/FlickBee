const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">About FlickBees</h1>

      <p className="text-gray-600 mb-6 leading-relaxed">
        FlickBees is a fast and reliable grocery delivery platform designed to
        make everyday shopping easier. Our goal is to provide fresh groceries,
        fruits, vegetables, and daily essentials delivered straight to your
        doorstep within minutes.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mt-10">
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
          <p className="text-gray-600">
            To simplify grocery shopping by delivering fresh and high-quality
            products quickly and conveniently while ensuring excellent customer
            service.
          </p>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Our Vision</h2>
          <p className="text-gray-600">
            To become the most trusted online grocery platform by providing
            reliable delivery, affordable prices, and a seamless shopping
            experience.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-green-50 border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-3">Why Choose FlickBees?</h2>

        <ul className="space-y-2 text-gray-700">
          <li>✔ Fresh and quality products</li>
          <li>✔ Fast delivery within minutes</li>
          <li>✔ Easy and secure payment methods</li>
          <li>✔ User-friendly shopping experience</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
