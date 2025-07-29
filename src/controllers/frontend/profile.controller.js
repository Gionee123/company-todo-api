const profilemodel = require('../../models/profile.model');


exports.create = async (request, response) => {
    console.log(request.body);
    const data = new profilemodel({
        name: request.body.name,
        age: request.body.age,
        title: request.body.title,
        location: request.body.location,
        rating: request.body.rating,
        experience: request.body.experience,
        projects: request.body.projects,
        description: request.body.description,
        skills: request.body.skills,
        // profileImage: request.file.profileImage,
        status: request.body.status,
    })
    if (request.file) {
        if (request.file.filename) {
            data['profileImage'] = request.file.filename;
        }
    }
    await data.save()

        .then(result => {
            response.status(200).json({
                status: true,
                message: "Profile created successfully",
                data: result
            });
        })
        .catch(error => {
            console.error("Error in creating profile:", error);
            response.status(500).json({
                status: false,
                message: "Server error while creating profile",
                error: error.message
            });
        });

}

exports.view = async (request, response) => {
    console.log(request.body);
    profilemodel.find()
        .then(result => {
            response.status(200).json({
                status: true,
                message: "Profiles fetched successfully",
                imagepath: 'uploads/Images/',
                data: result
            });
        })
        .catch(error => {
            response.status(500).json({
                status: false,
                message: "Server error while fetching profiles",
                error: error.message
            });
        });
};

exports.details = async (request, response) => {
    const id = request.params.id;

    if (!id) {
        return response.status(400).json({
            status: false,
            message: "ID is required"
        });
    }

    try {
        const profile = await profilemodel.findById(id);

        if (!profile) {
            return response.status(404).json({
                status: false,
                message: "Profile not found"
            });
        }

        response.status(200).json({
            status: true,
            message: "Profile details fetched successfully",
            data: profile,
            imagepath: 'uploads/Images/',

        });

    } catch (error) {
        console.error("Error fetching profile details:", error);
        response.status(500).json({
            status: false,
            message: "Server error",
            error: error.message
        });
    }
};



